/* ===== Lawti 数据接口层 =====
 * 纯前端 + Supabase 云端存储
 */

const SUPABASE_URL = 'https://thcewknmdhzctnykrcve.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Jn5hMr1sdm-XrZ7OdM6g2A_fhmALJ9O';

const API = {

  async loadQuestions() {
    const res = await fetch('data/questions.json');
    if (!res.ok) throw new Error('题库加载失败');
    return await res.json();
  },

  async loadPersonalities() {
    const res = await fetch('data/personalities.json');
    if (!res.ok) throw new Error('人格数据加载失败');
    return await res.json();
  },

  saveCurrentAnswers(answers) {
    localStorage.setItem('lawti_current', JSON.stringify(answers));
  },

  getCurrentAnswers() {
    const raw = localStorage.getItem('lawti_current');
    return raw ? JSON.parse(raw) : null;
  },

  saveStartTime(t) {
    localStorage.setItem('lawti_start', String(t));
  },

  getStartTime() {
    return parseInt(localStorage.getItem('lawti_start') || '0', 10);
  },

  saveRecordLocal(record) {
    const all = API.getRecords();
    all.push(record);
    localStorage.setItem('lawti_records', JSON.stringify(all));
  },

  getRecords() {
    const raw = localStorage.getItem('lawti_records');
    return raw ? JSON.parse(raw) : [];
  },

  clearRecords() {
    localStorage.removeItem('lawti_records');
  },

  async uploadToCloud(record) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/lawti_records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          session_id: record.session_id,
          answers: record.answers,
          result_code: record.result_code,
          result_name: record.result_name,
          duration: record.duration
        })
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn('云端上传失败:', res.status, txt);
        return false;
      }
      console.log('云端上传成功');
      return true;
    } catch (e) {
      console.warn('云端上传异常:', e);
      return false;
    }
  },

  async saveRecord(record) {
    API.saveRecordLocal(record);
    await API.uploadToCloud(record);
  }
};
