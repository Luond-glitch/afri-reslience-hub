AOS.init({ once: true, offset: 20, duration: 500 });
let adminActive = false;
let keysPressed = {};

function checkSecretCombo() {
  if (keysPressed['KeyA'] && keysPressed['KeyD']) {
    if (!adminActive) enableAdminMode();
    else disableAdminMode();
    keysPressed = {};
  }
}

function enableAdminMode() {
  adminActive = true;
  document.body.classList.add('admin-mode');
  renderOpportunities();
  showToast('🔐 Admin mode enabled. Delete buttons visible.', '#1b6b45');
}

function disableAdminMode() {
  adminActive = false;
  document.body.classList.remove('admin-mode');
  const adminFormWrapper = document.getElementById('adminFormWrapper');
  if (adminFormWrapper) adminFormWrapper.style.display = 'none';
  const adminIcon = document.getElementById('adminIcon');
  if (adminIcon) adminIcon.className = 'fas fa-plus-circle';
  renderOpportunities();
  showToast('🔒 Admin mode disabled.', '#4a627a');
}

function showToast(message, bgColor) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.right = '20px';
  toast.style.backgroundColor = bgColor;
  toast.style.color = 'white';
  toast.style.padding = '10px 18px';
  toast.style.borderRadius = '40px';
  toast.style.fontSize = '0.85rem';
  toast.style.zIndex = '1000';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyA' || e.code === 'KeyD') {
    keysPressed[e.code] = true;
    checkSecretCombo();
  }
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyA' || e.code === 'KeyD') delete keysPressed[e.code];
});

// ---------- OPPORTUNITIES DATA ----------
let opportunities = [];

function isExpired(deadlineDateStr) {
  if (!deadlineDateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDateStr);
  deadline.setHours(0, 0, 0, 0);
  return deadline < today;
}

function removeExpiredOpportunities() {
  const beforeCount = opportunities.length;
  opportunities = opportunities.filter(opp => !isExpired(opp.deadlineDate));
  if (beforeCount !== opportunities.length) saveOpportunities();
}

function loadOpportunities() {
  const stored = localStorage.getItem('arhica_careers_data');
  if (stored) {
    try {
      opportunities = JSON.parse(stored);
    } catch(e) { opportunities = getDefaultData(); }
  } else {
    opportunities = getDefaultData();
    saveOpportunities();
  }
  removeExpiredOpportunities();
}

function getDefaultData() {
  const futureDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };
  return [
    { id: 'vac1', title: 'Climate Resilience Coordinator', desc: 'Lead community-driven adaptation projects across Lake Victoria Basin. Engage local stakeholders and manage field teams.', location: 'Kisumu, Kenya (with travel)', deadlineDate: futureDate(45), deadlineDisplay: '15 Dec 2025', category: 'vacancies', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'vac2', title: 'Monitoring & Evaluation Officer', desc: 'Track impact of climate programs, develop M&E frameworks, reporting to donors.', location: 'Homa Bay / Remote hybrid', deadlineDate: futureDate(60), deadlineDisplay: '10 Jan 2026', category: 'vacancies', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'int1', title: 'GIS & Data Analysis Intern', desc: 'Support mapping of climate vulnerabilities, assist research team. 3 months paid internship.', location: 'Kisumu (flexible)', deadlineDate: futureDate(30), deadlineDisplay: 'Jan - March 2026', category: 'internships', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'int2', title: 'Communications & Advocacy Intern', desc: 'Create content, manage social media, and support advocacy campaigns for climate justice.', location: 'Nairobi or Remote', deadlineDate: futureDate(20), deadlineDisplay: 'Rolling application', category: 'internships', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'vol1', title: 'Community Mobilizer (Volunteer)', desc: 'Engage youth groups, assist in workshops and tree planting initiatives.', location: 'Various LVB counties', deadlineDate: futureDate(90), deadlineDisplay: 'Open - 6 month commitment', category: 'volunteer', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'vol2', title: 'Environmental Education Volunteer', desc: 'Help deliver climate literacy sessions in schools and local hubs.', location: 'Siaya, Busia', deadlineDate: futureDate(60), deadlineDisplay: 'Flexible schedule', category: 'volunteer', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'fell1', title: 'Early Career Research Fellowship - Climate Adaptation', desc: '6-month fellowship focusing on agroecology & water resilience.', location: 'Kenya (field + remote)', deadlineDate: futureDate(120), deadlineDisplay: 'Closes 28 Feb 2026', category: 'fellowships', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'apply1', title: 'General Application: Program Associate', desc: 'Send your CV and motivation for future opportunities.', location: 'Flexible (East Africa)', deadlineDate: futureDate(180), deadlineDisplay: 'Open call – ongoing', category: 'apply', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() },
    { id: 'apply2', title: 'Finance & Admin Assistant', desc: 'Support day-to-day finance operations and admin tasks.', location: 'Kisumu Head Office', deadlineDate: futureDate(45), deadlineDisplay: 'Open until filled', category: 'apply', contactEmail: 'arhicakis@gmail.com', dateAdded: Date.now() }
  ];
}

function saveOpportunities() { localStorage.setItem('arhica_careers_data', JSON.stringify(opportunities)); }
function getByCategory(category) { return opportunities.filter(opp => opp.category === category); }

let currentCategory = 'vacancies';
function openEmailClient(oppTitle, contactEmail) {
  const email = contactEmail || 'arhicakis@gmail.com';
  const subject = encodeURIComponent(`Application Interest: ${oppTitle} - ARHICA Careers`);
  const body = encodeURIComponent(
`Dear Hiring Team,

I am very interested in the opportunity: "${oppTitle}".

I would like to express my interest and submit my application. Please find my CV and relevant documents attached.

Best regards,
[Your Full Name]
[Your Phone Number]
[Your Email]`
  );
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
}

function deleteOpportunity(oppId) {
  if (confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
    opportunities = opportunities.filter(opp => opp.id !== oppId);
    saveOpportunities();
    renderOpportunities();
    showToast('🗑️ Opportunity deleted successfully.', '#c0392b');
  }
}

function formatDeadlineDisplay(deadlineDate) {
  if (!deadlineDate) return 'No deadline';
  const date = new Date(deadlineDate);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderOpportunities() {
  const container = document.getElementById('opportunitiesContainer');
  if (!container) return;
  
  removeExpiredOpportunities();
  const filtered = getByCategory(currentCategory);
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" data-aos="fade-up">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="45" r="35" fill="#FDEBD0" stroke="#E8C39E" stroke-width="2"/>
          <circle cx="35" cy="40" r="4" fill="#5D6D5C"/>
          <circle cx="65" cy="40" r="4" fill="#5D6D5C"/>
          <path d="M40 55 Q50 65 60 55" stroke="#8B6914" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M50 25 L50 35 M50 25 L45 30 M50 25 L55 30" stroke="#E8C39E" stroke-width="2" stroke-linecap="round"/>
          <path d="M30 20 L25 15 M70 20 L75 15" stroke="#C4A882" stroke-width="2" stroke-linecap="round"/>
          <text x="50" y="85" text-anchor="middle" font-size="10" fill="#8B6914" font-family="Arial">😢</text>
        </svg>
        <h3>🌱 Oops! Currently there are no opportunities</h3>
        <p>Keep on visiting for updates — new roles will appear here soon.</p>
      </div>
    `;
    return;
  }
  
  let cardsHtml = '';
  filtered.forEach(opp => {
    let categoryLabel = '';
    switch(opp.category) {
      case 'vacancies': categoryLabel = '📢 Open Vacancy'; break;
      case 'internships': categoryLabel = '🎓 Internship'; break;
      case 'volunteer': categoryLabel = '🤝 Volunteer'; break;
      case 'fellowships': categoryLabel = '🔬 Research/Fellowship'; break;
      case 'apply': categoryLabel = '✉️ Apply Now'; break;
      default: categoryLabel = '⭐ Opportunity';
    }
    
    const expired = opp.deadlineDate ? isExpired(opp.deadlineDate) : false;
    const deadlineText = opp.deadlineDisplay || formatDeadlineDisplay(opp.deadlineDate);
    const contactEmail = opp.contactEmail || 'arhicakis@gmail.com';
    
    cardsHtml += `
      <div class="opportunity-card" data-aos="fade-up" data-aos-delay="30">
        ${expired ? '<div class="expired-badge"><i class="fas fa-clock"></i> Expired</div>' : ''}
        <div class="card-badge">${categoryLabel}</div>
        <h3>${escapeHtml(opp.title)}</h3>
        <div class="desc">${escapeHtml(opp.desc)}</div>
        <div class="meta-info">
          <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(opp.location)}</span>
          <span><i class="fas fa-calendar-alt"></i> <span class="${expired ? 'deadline-expired' : ''}">${escapeHtml(deadlineText)}</span></span>
        </div>
        <div class="contact-email">
          <i class="fas fa-envelope"></i> <strong>Apply via:</strong> ${escapeHtml(contactEmail)}
        </div>
        <div class="card-footer">
          <button class="apply-btn" data-title="${escapeHtml(opp.title)}" data-email="${escapeHtml(contactEmail)}">
            <i class="fas fa-paper-plane"></i> Apply Now
          </button>
          <button class="delete-btn" data-id="${opp.id}">
            <i class="fas fa-trash-alt"></i> Delete Opportunity
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = cardsHtml;
  
  // Attach apply button event listeners
  document.querySelectorAll('.apply-btn').forEach(btn => {
    btn.removeEventListener('click', handleApplyClick);
    btn.addEventListener('click', handleApplyClick);
  });
  
  // Attach delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.removeEventListener('click', handleDeleteClick);
    btn.addEventListener('click', handleDeleteClick);
  });
}

function handleApplyClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const title = this.getAttribute('data-title');
  const email = this.getAttribute('data-email');
  if (title) {
    openEmailClient(title, email);
  }
}

function handleDeleteClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const id = this.getAttribute('data-id');
  if (id) deleteOpportunity(id);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      if (!category) return;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = category;
      renderOpportunities();
    });
  });
}

function setupAdminLogic() {
  const toggleBtn = document.getElementById('toggleAdminBtn');
  const adminFormWrapper = document.getElementById('adminFormWrapper');
  const adminIcon = document.getElementById('adminIcon');
  let formVisible = false;
  if (toggleBtn && adminFormWrapper) {
    toggleBtn.addEventListener('click', () => {
      formVisible = !formVisible;
      adminFormWrapper.style.display = formVisible ? 'block' : 'none';
      if (adminIcon) adminIcon.className = formVisible ? 'fas fa-minus-circle' : 'fas fa-plus-circle';
    });
  }
  const addBtn = document.getElementById('addOpportunityBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.getElementById('oppTitle')?.value.trim();
      const category = document.getElementById('oppCategory')?.value;
      const desc = document.getElementById('oppDesc')?.value.trim();
      const location = document.getElementById('oppLocation')?.value.trim();
      const deadlineDate = document.getElementById('oppDeadlineDate')?.value;
      const contactEmail = document.getElementById('oppEmail')?.value.trim() || 'arhicakis@gmail.com';
      
      if (!title || !desc) { alert('Please provide title and description.'); return; }
      
      const displayDate = deadlineDate ? new Date(deadlineDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Rolling deadline';
      
      const newOpp = {
        id: 'opp_' + Date.now() + '_' + Math.random(),
        title: title,
        desc: desc,
        location: location || 'Lake Victoria Basin, Kenya',
        deadlineDate: deadlineDate || null,
        deadlineDisplay: displayDate,
        category: category,
        contactEmail: contactEmail,
        dateAdded: Date.now()
      };
      opportunities.push(newOpp);
      saveOpportunities();
      document.getElementById('oppTitle').value = '';
      document.getElementById('oppDesc').value = '';
      document.getElementById('oppLocation').value = '';
      document.getElementById('oppDeadlineDate').value = '';
      document.getElementById('oppEmail').value = 'arhicakis@gmail.com';
      if (currentCategory === category) renderOpportunities();
      else alert(`✅ Added under "${category}". Switch to that tab to view.`);
      showToast('✨ New opportunity published!', '#1b6b45');
    });
  }
}

function initBackButton() {
  const backBtn = document.getElementById('backToMainBtn');
  if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = './index.html'; });
}

function setInitialTab() {
  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) currentCategory = activeTab.getAttribute('data-category');
}

setInterval(() => {
  removeExpiredOpportunities();
  renderOpportunities();
}, 3600000);

function init() {
  loadOpportunities();
  initTabs();
  setupAdminLogic();
  initBackButton();
  setInitialTab();
  renderOpportunities();
  document.body.classList.remove('admin-mode');
  adminActive = false;
}

init();