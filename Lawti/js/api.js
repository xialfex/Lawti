/* ===== Lawti 数据接口层 =====
 * 纯前端阶段：fetch 读 JSON，localStorage 存数据
 * 加 Python 后端后：只改这个文件里的 URL 即可
 */

const API = {

  // 读取题库
  async loadQuestions() {
    const res = await fetch('data/questions.json');
    if (!res.ok) throw new Error('题库加载失败');
    return await res.json();
  },

  // 读取人格数据
  async loadPersonalities() {
    const res = await fetch('data/personalities.json');
    if (!res.ok) throw new Error('人格数据加载失败');
    return await res.json();
  },

  // 保存当前测试答案（临时，用于结果页读取）
  saveCurrentAnswers(answers) {
    localStorage.setItem('lawti_current', JSON.stringify(answers));
  },

  // 读取当前测试答案
  getCurrentAnswers() {
    const raw = localStorage.getItem('lawti_current');
    return raw ? JSON.parse(raw) : null;
  },

  // 保存一条测试记录
  saveRecord(record) {
    const all = API.getRecords();
    all.push(record);
    localStorage.setItem('lawti_records', JSON.stringify(all));
  },

  // 读取全部测试记录
  getRecords() {
    const raw = localStorage.getItem('lawti_records');
    return raw ? JSON.parse(raw) : [];
  },

  // 清空记录（调试用）
  clearRecords() {
    localStorage.removeItem('lawti_records');
  }
};