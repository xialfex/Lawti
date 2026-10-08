/* ===== Lawti 评分逻辑 =====
 * 输入：answers = { 题目id: { dim: 'dim1', letter: 'S' }, ... }
 * 输出：{ code: 'M-T-F-I', dims: {...}, detail: {...} }
 */

function calculateResult(answers) {
  const dims = {
    dim1: { M: 0, S: 0 },
    dim2: { T: 0, P: 0 },
    dim3: { F: 0, E: 0 },
    dim4: { I: 0, C: 0 }
  };

  for (const qid in answers) {
    const ans = answers[qid];
    if (ans && ans.dim && ans.letter) {
      dims[ans.dim][ans.letter]++;
    }
  }

  // 平局默认取左：M / T / F / I
  const r = {
    dim1: dims.dim1.M >= dims.dim1.S ? 'M' : 'S',
    dim2: dims.dim2.T >= dims.dim2.P ? 'T' : 'P',
    dim3: dims.dim3.F >= dims.dim3.E ? 'F' : 'E',
    dim4: dims.dim4.I >= dims.dim4.C ? 'I' : 'C'
  };

  return {
    code: `${r.dim1}-${r.dim2}-${r.dim3}-${r.dim4}`,
    dims: r,
    detail: dims
  };
}