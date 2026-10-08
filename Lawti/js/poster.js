/* ===== Lawti 海报生成 ===== */

async function generatePoster() {
  const poster = document.getElementById('posterContent');
  if (!poster) return;

  try {
    const canvas = await html2canvas(poster, {
      scale: 2,
      backgroundColor: null,
      useCORS: true
    });

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Lawti_' + Date.now() + '.png';
      link.click();

      // 移动端提示
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        setTimeout(() => {
          alert('海报已生成，请在下载文件夹中查看，或长按图片保存到相册。');
        }, 300);
      }
    });
  } catch (e) {
    alert('海报生成失败：' + e.message);
  }
}