// main.js - loads data/profile.json and renders both Classic and Interactive modes.
// Toggle the checkbox to switch modes. Interactive mode shows chart and collapsible items.

const modeSwitch = document.getElementById('modeSwitch');
const body = document.body;

// elements
const nameEl = document.getElementById('name');
const headlineEl = document.getElementById('headline');
const linkedinBtn = document.getElementById('linkedinBtn');
const aboutEl = document.getElementById('about');
const experienceList = document.getElementById('experienceList');
const recognitionsList = document.getElementById('recognitionsList');
const certificationsList = document.getElementById('certificationsList');
const coursesList = document.getElementById('coursesList');
const skillsList = document.getElementById('skillsList');
const skillsChartEl = document.getElementById('skillsChart');
const contactInfo = document.getElementById('contactInfo');
const downloadBtn = document.getElementById('downloadBtn');

let profile = null;
let skillsChart = null;

async function loadProfile(){
  try{
    const res = await fetch('data/profile.json');
    profile = await res.json();
    renderAll();
  }catch(e){
    console.error('Failed to load profile.json', e);
    aboutEl.textContent = 'Error loading profile. Please make sure data/profile.json exists.';
  }
}

function renderAll(){
  if(!profile) return;
  nameEl.textContent = profile.name || 'Your Name';
  headlineEl.textContent = profile.headline || '';
  linkedinBtn.href = profile.social?.linkedin || '#';
  linkedinBtn.textContent = 'LinkedIn';

  aboutEl.textContent = profile.about || '';

  // Experience
  experienceList.innerHTML = '';
  (profile.experience || []).forEach((exp, idx) => {
    const el = document.createElement('div');
    el.className = 'experience-item';
    el.innerHTML = `
      <h3>${exp.title} — ${exp.company}</h3>
      <div class="meta">${exp.period || ''} • ${exp.location || ''}</div>
      <div class="desc">${exp.summary || ''}</div>
    `;
    // collapsible details in interactive mode
    el.addEventListener('click', () => {
      if(body.classList.contains('interactive')){
        el.classList.toggle('open');
        const d = el.querySelector('.desc');
        if(d) d.classList.toggle('hidden');
      }
    });
    experienceList.appendChild(el);
  });

  // Recognitions
  recognitionsList.innerHTML = (profile.recognitions || []).map(r => `<div class="small">${r}</div>`).join('');

  // Certifications
  certificationsList.innerHTML = (profile.certifications || []).map(c => `
    <div class="small">${c.name} — <em>${c.issuer}</em> (${c.year || ''})</div>
  `).join('');

  // Courses & Labs
  coursesList.innerHTML = (profile.courses || []).map(c => `<div class="small">${c}</div>`).join('');

  // Skills
  skillsList.innerHTML = '';
  const skillLabels = [];
  const skillValues = [];
  (profile.skills || []).forEach(s => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.textContent = s.name;
    skillsList.appendChild(pill);
    skillLabels.push(s.name);
    skillValues.push(s.level || 60);
  });

  // Render chart (interactive)
  renderSkillsChart(skillLabels, skillValues);

  // Contact
  contactInfo.innerHTML = `
    <div>Email: <a href="mailto:${profile.contact?.email || ''}">${profile.contact?.email || ''}</a></div>
    <div>Location: ${profile.contact?.location || ''}</div>
    <div>Website: ${profile.contact?.website ? `<a href="${profile.contact.website}" target="_blank">${profile.contact.website}</a>` : ''}</div>
  `;

  // download PDF (simple print)
  downloadBtn.addEventListener('click', () => {
    window.print();
  });
}

function renderSkillsChart(labels, values){
  if(!skillsChartEl) return;
  if(skillsChart) skillsChart.destroy();
  // show canvas only in interactive mode
  skillsChartEl.style.display = body.classList.contains('interactive') ? 'block' : 'none';
  skillsChart = new Chart(skillsChartEl.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Proficiency',
        data: values,
        backgroundColor: 'rgba(59,130,246,0.8)',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { max:100, ticks:{stepSize:20} }
      },
      plugins: { legend:{display:false}, tooltip:{enabled:true} }
    }
  });
}

// mode switch behavior
modeSwitch.addEventListener('change', (e) => {
  if(modeSwitch.checked){
    body.classList.add('interactive');
    body.classList.remove('classic');
  }else{
    body.classList.add('classic');
    body.classList.remove('interactive');
  }
  // re-render chart visibility
  if(profile){
    renderSkillsChart(
      (profile.skills || []).map(s => s.name),
      (profile.skills || []).map(s => s.level || 60)
    );
    // hide long descriptions in classic mode
    document.querySelectorAll('.experience-item .desc').forEach(d => {
      d.classList.toggle('hidden', !body.classList.contains('interactive'));
    });
  }
});

// initial state
body.classList.add('classic');

// fetch and render
loadProfile();