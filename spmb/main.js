// ========== KONFIGURASI ==========
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyg0ViGMFYazHB7JpTF4rY1nEh_ISbsVcoKP1WnGLOWSqixd_lDXFkWYxvYT2QqnFcV/exec',
};

// ========== STATE ==========
let currentStep = 1;
const totalSteps = 5;

// ========== DOM ELEMENTS ==========
const elements = {
  syarat: document.getElementById('stepSyarat'),
  form: document.getElementById('ppdbForm'),
  sukses: document.getElementById('stepSukses'),
  pdfLink: document.getElementById('pdfLink'),
  kirimBtn: document.getElementById('kirimBtn'),
  progressFill: document.getElementById('progressFill'),
  btnSetuju: document.getElementById('btnSetuju'),
  btnRefresh: document.getElementById('btnRefresh'),
  progressSteps: document.querySelectorAll('.progress-step')
};

// ========== UPDATE PROGRESS BAR ==========
function updateProgress() {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  if (elements.progressFill) {
    elements.progressFill.style.width = progress + '%';
  }
  
  // Update step classes
  elements.progressSteps.forEach((step, idx) => {
    const stepNum = idx + 1;
    step.classList.remove('active', 'done');
    if (stepNum < currentStep) step.classList.add('done');
    if (stepNum === currentStep) step.classList.add('active');
  });
}

// ========== SHOW STEP ==========
function showStep(step) {
  // Hide all sections
  if (elements.syarat) elements.syarat.style.display = 'none';
  if (elements.form) elements.form.style.display = 'none';
  if (elements.sukses) elements.sukses.style.display = 'none';
  
  // Hide all form sections
  document.querySelectorAll('.form-section').forEach(section => {
    section.style.display = 'none';
  });
  
  if (step === 1) {
    if (elements.syarat) elements.syarat.style.display = 'block';
  } else if (step === 5) {
    if (elements.sukses) elements.sukses.style.display = 'block';
    if (elements.form) elements.form.style.display = 'none';
  } else {
    if (elements.form) elements.form.style.display = 'block';
    const targetSection = document.querySelector(`#step${getStepName(step)}`);
    if (targetSection) targetSection.style.display = 'block';
  }
  
  currentStep = step;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStepName(step) {
  const names = { 2: 'Siswa', 3: 'Periodik', 4: 'Ortu' };
  return names[step];
}

// ========== VALIDATION ==========
function validateStep(step) {
  if (step === 1 || step === 5) return true;
  
  const stepName = getStepName(step);
  const section = document.getElementById(`step${stepName}`);
  const requiredFields = section.querySelectorAll('[required]');
  let valid = true;
  
  requiredFields.forEach(field => {
    const errorMsg = field.parentElement.querySelector('.error-msg');
    field.classList.remove('error');
    if (errorMsg) errorMsg.style.display = 'none';
    
    if (!field.value.trim()) {
      valid = false;
      field.classList.add('error');
    } else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
      valid = false;
      field.classList.add('error');
      if (errorMsg) errorMsg.style.display = 'block';
    }
  });
  
  if (!valid) {
    const firstError = section.querySelector('.error');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  return valid;
}

// ========== SUBMIT FORM ==========
async function submitForm(formData) {
  const encoded = new URLSearchParams(formData);
  
  const response = await fetch(CONFIG.SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: encoded
  });
  
  return { result: "success" };
}

// ========== EVENT LISTENERS ==========
function setupEvents() {
  // Tombol Setuju
  elements.btnSetuju?.addEventListener('click', () => showStep(2));
  
  // Tombol Next
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        const nextStep = btn.dataset.next;
        const stepMap = { siswa: 2, periodik: 3, ortu: 4 };
        showStep(stepMap[nextStep] || currentStep + 1);
      }
    });
  });
  
  // Tombol Back
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const backStep = btn.dataset.back;
      const stepMap = { syarat: 1, siswa: 2, periodik: 3, ortu: 4 };
      showStep(stepMap[backStep] || currentStep - 1);
    });
  });
  
  // Click on progress step to navigate
  elements.progressSteps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      const targetStep = idx + 1;
      if (targetStep < currentStep) {
        showStep(targetStep);
      }
    });
  });
  
  // Submit Form
  elements.form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    const btn = elements.kirimBtn;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
    
    const formData = new FormData(elements.form);
    
    try {
      const encoded = new URLSearchParams(formData);
      const response = await fetch(CONFIG.SCRIPT_URL, {
        method: "POST",
        body: encoded
      });
      
      const result = await response.json();
      
      if (result.result === "success") {
        if (result.pdfUrl) {
          elements.pdfLink.href = result.pdfUrl;
          elements.pdfLink.style.display = "inline-flex";
        }
        
        showStep(5);
        elements.form.reset();
      } else {
        throw new Error(result.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan: " + err.message + "\n\nSilakan coba lagi atau hubungi panitia PPDB.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
  
  // Refresh
  elements.btnRefresh?.addEventListener('click', () => {
    location.reload();
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  updateProgress();
});