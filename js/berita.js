// ========== BLOG POSTS FETCHER ==========
const beritaContainer = document.getElementById('blog-posts');

if (beritaContainer) {
  const proxy = "https://api.allorigins.win/get?url=";
  const feedURL = encodeURIComponent("https://smknegeri2lebong.blogspot.com/feeds/posts/default?alt=json");

  async function loadBerita() {
    beritaContainer.innerHTML = '<div class="loading">Memuat berita terbaru...</div>';
    
    try {
      const response = await fetch(proxy + feedURL);
      const result = await response.json();
      const data = JSON.parse(result.contents);
      const entries = data.feed.entry || [];

      if (entries.length === 0) {
        beritaContainer.innerHTML = '<div class="alert alert-info">Belum ada berita terbaru.</div>';
        return;
      }

      let html = '';
      entries.slice(0, 6).forEach(entry => {
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const published = new Date(entry.published.$t).toLocaleDateString("id-ID", {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const thumbnail = entry.media$thumbnail?.url.replace(/\/s72\-c/, "/s600") || '';
        const content = entry.content?.$t || '';
        const snippet = content.replace(/<[^>]+>/g, "").slice(0, 150) + (content.length > 150 ? '...' : '');

        html += `
          <div class="blog-post">
            ${thumbnail ? `<img src="${thumbnail}" alt="${title}" loading="lazy">` : ''}
            <h3>${escapeHtml(title)}</h3>
            <small>📅 ${published}</small>
            <p>${escapeHtml(snippet)}</p>
            <a href="${link}" target="_blank" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Baca Selengkapnya →</a>
          </div>
        `;
      });
      
      beritaContainer.innerHTML = html;
    } catch (error) {
      console.error("Gagal memuat berita:", error);
      beritaContainer.innerHTML = '<div class="alert alert-info">Tidak dapat memuat berita saat ini. Silakan coba lagi nanti.</div>';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadBerita();
}