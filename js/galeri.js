// ========== GALERI HANDLER ==========
function showTab(tabName) {
  const fotoTab = document.getElementById('foto');
  const videoTab = document.getElementById('video');
  
  if (tabName === 'foto') {
    fotoTab.style.display = 'block';
    videoTab.style.display = 'none';
  } else {
    fotoTab.style.display = 'none';
    videoTab.style.display = 'block';
  }
}

// Load Foto Gallery
async function loadFotoGallery() {
  const fotoGrid = document.getElementById('foto-grid');
  if (!fotoGrid) return;
  
  fotoGrid.innerHTML = '<div class="loading">Memuat foto...</div>';
  
  try {
    const response = await fetch('assets/galeri_foto.txt');
    const data = await response.text();
    const lines = data.trim().split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      fotoGrid.innerHTML = '<p class="alert alert-info">Belum ada foto yang diupload.</p>';
      return;
    }
    
    let html = '<div class="galeri-grid">';
    lines.forEach(url => {
      html += `
        <div class="galeri-item" onclick="openModal('${url}')">
          <img src="${url}" alt="Foto Kegiatan" loading="lazy">
        </div>
      `;
    });
    html += '</div>';
    
    fotoGrid.innerHTML = html;
  } catch (error) {
    console.error('Error loading foto:', error);
    fotoGrid.innerHTML = '<p class="alert alert-info">Gagal memuat galeri foto.</p>';
  }
}

// Load Video Gallery
async function loadVideoGallery() {
  const videoList = document.getElementById('video-list');
  if (!videoList) return;
  
  videoList.innerHTML = '<div class="loading">Memuat video...</div>';
  
  try {
    const response = await fetch('assets/galeri_video.txt');
    const data = await response.text();
    const blocks = data.split(/#(.+?)\n/).slice(1);
    
    if (blocks.length === 0) {
      videoList.innerHTML = '<p class="alert alert-info">Belum ada video yang diupload.</p>';
      return;
    }
    
    let html = '';
    for (let i = 0; i < blocks.length; i += 2) {
      const title = blocks[i].trim();
      const url = blocks[i+1]?.trim();
      
      if (!url) continue;
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('embed')) {
          videoId = url.split('/').pop();
        } else if (url.includes('youtu.be')) {
          videoId = url.split('/').pop();
        } else {
          const urlParams = new URL(url).searchParams;
          videoId = urlParams.get('v');
        }
        
        html += `
          <div class="card">
            <h3>${escapeHtml(title)}</h3>
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
              <iframe src="https://www.youtube.com/embed/${videoId}" 
                      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
              </iframe>
            </div>
          </div>
        `;
      } else if (url.includes('facebook.com')) {
        html += `
          <div class="card">
            <h3>${escapeHtml(title)}</h3>
            <p>Video tersedia di Facebook.</p>
            <a href="${url}" class="btn" target="_blank">Tonton di Facebook →</a>
          </div>
        `;
      }
    }
    
    videoList.innerHTML = html || '<p class="alert alert-info">Tidak ada video yang dapat ditampilkan.</p>';
  } catch (error) {
    console.error('Error loading video:', error);
    videoList.innerHTML = '<p class="alert alert-info">Gagal memuat galeri video.</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Modal for image preview
function openModal(imageUrl) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
  `;
  
  modal.appendChild(img);
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

// Initialize gallery
if (document.getElementById('foto-grid')) {
  loadFotoGallery();
  loadVideoGallery();
}