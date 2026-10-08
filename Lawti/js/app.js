/* ===== Lawti 页面逻辑 ===== */

let QUESTIONS = [];
let PERSONALITIES = {};
let currentIndex = 0;
let answers = {};
let startTime = 0;

/* ---------- 答题页 ---------- */
async function initTestPage() {
  try {
    const data = await API.loadQuestions();
    QUESTIONS = data.questions;
    startTime = Date.now();
    API.saveStartTime(startTime);
    renderQuestion();
  } catch (e) {
    showError('test', e.message + '。请确认使用 Live Server 或本地服务器打开，不要直接双击 HTML 文件。');
  }
}

function renderQuestion() {
  document.getElementById('loadingArea').style.display = 'none';
  document.getElementById('questionArea').style.display = 'block';

  const q = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  document.getElementById('progressText').innerText = `第 ${currentIndex + 1} 题 / 共 ${total} 题`;
  document.getElementById('progressFill').style.width = ((currentIndex) / total * 100) + '%';

  document.getElementById('sceneTag').innerText = q.scene || '';
  document.getElementById('questionStem').innerText = q.stem;

  const box = document.getElementById('optionsBox');
  box.innerHTML = '';

  q.options.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'option';
    if (answers[q.id] && answers[q.id].letter === opt.letter) {
      div.classList.add('selected');
    }
    div.innerHTML = `
      <div class="option-key">${opt.key}</div>
      <div class="option-text">${opt.text}</div>
    `;
    div.onclick = () => selectOption(q.id, opt);
    box.appendChild(div);
  });

  document.getElementById('btnPrev').style.display = currentIndex === 0 ? 'none' : 'block';

  const btnNext = document.getElementById('btnNext');
  btnNext.disabled = !answers[q.id];
  btnNext.innerText = currentIndex === total - 1 ? '查看结果' : '下一题';
}

function selectOption(qid, opt) {
  answers[qid] = { dim: opt.dim, letter: opt.letter };

  const box = document.getElementById('optionsBox');
  Array.from(box.children).forEach((child, i) => {
    const q = QUESTIONS[currentIndex];
    if (q.options[i].letter === opt.letter) {
      child.classList.add('selected');
    } else {
      child.classList.remove('selected');
    }
  });

  document.getElementById('btnNext').disabled = false;
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function nextQuestion() {
  if (!answers[QUESTIONS[currentIndex].id]) return;

  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    // 最后一题，保存答案并跳转
    API.saveCurrentAnswers(answers);
    window.location.href = 'result.html';
  }
}

/* ---------- 结果页 ---------- */
async function initResultPage() {
  try {
    const answersData = API.getCurrentAnswers();
    if (!answersData || Object.keys(answersData).length === 0) {
      showError('result', '没有找到测试记录，请先完成测试。');
      return;
    }

    const data = await API.loadPersonalities();
    PERSONALITIES = data.types;

    const result = calculateResult(answersData);
    const p = PERSONALITIES[result.code];

    if (!p) {
      showError('result', '未找到对应人格类型：' + result.code);
      return;
    }

    // 计算用时
    const st = API.getStartTime();
    const duration = st ? Math.round((Date.now() - st) / 1000) : 0;

    // 保存完整记录（本地 + 云端）
    await API.saveRecord({
      session_id: 'S' + Date.now(),
      answers: answersData,
      result_code: result.code,
      result_name: p.name,
      duration: duration,
      created_at: new Date().toISOString()
    });

    renderResult(p, result);
  } catch (e) {
    showError('result', e.message + '。请确认使用 Live Server 或本地服务器打开。');
  }
}

function renderResult(p, result) {
  document.getElementById('loadingArea').style.display = 'none';
  document.getElementById('resultArea').style.display = 'block';

  document.getElementById('resCode').innerText = p.code;
  document.getElementById('resName').innerText = '「' + p.name + '」';
  document.getElementById('resSchool').innerText = p.school;
  document.getElementById('resSlogan').innerText = '“' + p.slogan + '”';
  document.getElementById('resSummary').innerText = p.summary;

  const adviceBox = document.getElementById('resAdvice');
  adviceBox.innerHTML = '';
  p.advice.forEach(a => {
    const li = document.createElement('li');
    li.innerText = a;
    adviceBox.appendChild(li);
  });

  document.getElementById('resIdols').innerText = p.idols;
  document.getElementById('resCatchphrase').innerText = p.catchphrase;
  document.getElementById('resLaw').innerText = p.lawExample;

  // 填充海报内容
  document.getElementById('pCode').innerText = p.code;
  document.getElementById('pName').innerText = '「' + p.name + '」';
  document.getElementById('pSchool').innerText = p.school;
  document.getElementById('pSlogan').innerText = '“' + p.slogan + '”';
  document.getElementById('pShareText').innerText = p.summary.slice(0, 60) + '…';
}

/* ---------- 数据页 ---------- */
function renderDataPage() {
  const records = API.getRecords();
  const tableArea = document.getElementById('tableArea');

  document.getElementById('statTotal').innerText = records.length;

  if (records.length === 0) {
    document.getElementById('statAvg').innerText = '0s';
    document.getElementById('statTypes').innerText = '0';
    tableArea.innerHTML = '<div class="empty-tip">暂无测试数据。<br>完成一次测试后，这里会显示记录。</div>';
    return;
  }

  const avg = Math.round(records.reduce((s, r) => s + (r.duration || 0), 0) / records.length);
  document.getElementById('statAvg').innerText = avg + 's';

  const types = new Set(records.map(r => r.result_code));
  document.getElementById('statTypes').innerText = types.size;

  let html = '<table class="data-table"><thead><tr>' +
    '<th>时间</th><th>人格</th><th>用时</th>' +
    '</tr></thead><tbody>';

  records.slice().reverse().forEach(r => {
    const t = new Date(r.created_at);
    const timeStr = `${t.getMonth()+1}/${t.getDate()} ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
    html += `<tr>
      <td>${timeStr}</td>
      <td>${r.result_name || r.result_code}</td>
      <td>${r.duration || 0}s</td>
    </tr>`;
  });

  html += '</tbody></table>';
  tableArea.innerHTML = html;
}

function exportCSV() {
  const records = API.getRecords();
  if (records.length === 0) {
    alert('暂无数据可导出');
    return;
  }

  const headers = ['session_id', 'result_code', 'result_name', 'duration', 'created_at', 'answers'];
  const rows = records.map(r => [
    r.session_id,
    r.result_code,
    r.result_name,
    r.duration,
    r.created_at,
    JSON.stringify(r.answers)
  ]);

  let csv = '\uFEFF' + headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'lawti_data_' + Date.now() + '.csv';
  link.click();
}

/* ---------- 错误提示 ---------- */
function showError(page, msg) {
  const loading = document.getElementById('loadingArea');
  const err = document.getElementById('errorArea');
  if (loading) loading.style.display = 'none';
  if (err) {
    err.style.display = 'block';
    err.innerHTML = `<div class="error-tip">${msg}</div>
      <div style="text-align:center;margin-top:20px;">
        <a href="index.html" class="btn-restart" style="display:inline-block;padding:12px 32px;">返回首页</a>
      </div>`;
  }
}
