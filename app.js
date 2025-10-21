// Simple single-file app controlling both modes and the fake-terminal
(function(){
  // DOM
  const entry = document.getElementById('entry');
  const btnClassic = document.getElementById('btn-classic');
  const btnInteractive = document.getElementById('btn-interactive');
  const classic = document.getElementById('classic');
  const interactive = document.getElementById('interactive');

  // wire entry
  function openClassic(){ entry.style.display='none'; classic.classList.remove('hidden'); classic.setAttribute('aria-hidden','false'); }
  function openInteractive(){ entry.style.display='none'; interactive.classList.remove('hidden'); interactive.setAttribute('aria-hidden','false'); setupTerminal(); }

  btnClassic.addEventListener('click', openClassic);
  btnInteractive.addEventListener('click', openInteractive);

  // support hash links
  if(location.hash.includes('classic')) openClassic();
  if(location.hash.includes('interactive')) openInteractive();

  // ---------- Terminal logic ----------
  let termBody, cmdInput;
  const content = {
    about: `Rami Reddy Allam
Senior Security Analyst @Accenture
Hyderabad, India

A seasoned cybersecurity professional with expertise in penetration testing, security analysis, API & infrastructure testing. Strong background in automation for compliance and vulnerability management.`,
    experience: `Accenture — Senior Security Analyst (June 2024 - Present)
- Automation for app security and compliance
- Client delivery & vulnerability assessments

APTS — Senior Security Analyst (Sep 2021 - Jun 2024)
- Web & mobile pentests, infra VAPT, thick client testing`,
    skills: `Top skills:
- Web & Mobile App Pentesting
- Network Infrastructure VAPT
- API Security (REST/SOAP)
- Thick Client Testing
- Automation & Scripting
- Compliance (PCI DSS, GDPR)`,
    certs: `Certifications:
- AWS Knowledge: Cloud Essentials
- Oracle Cloud Infrastructure 2019 (Certified Architect Professional)
- Learn Ethical Hacking: Beginner to Advanced!
- Oracle Autonomous Database Cloud 2019 Certified Specialist`,
    linkedin: `Opening LinkedIn: https://www.linkedin.com/in/rami-reddy-allam-423a47104/`
  };

  function setupTerminal(){
    if(termBody) return; // already
    termBody = document.getElementById('term-body');
    cmdInput = document.getElementById('cmd-input');
    const form = document.getElementById('cmd-form');

    printWelcome();

    form.addEventListener('submit', e=>{
      const raw = cmdInput.value.trim();
      if(!raw) return;
      echo(`$ ${raw}`);
      handleCommand(raw);
      cmdInput.value='';
      termBody.scrollTop = termBody.scrollHeight;
    });

    // basic keyboard shortcuts
    cmdInput.addEventListener('keydown', e=>{
      if(e.key === 'Tab'){ e.preventDefault(); cmdInput.value = 'help'; }
    });
  }

  function printWelcome(){
    typeOut("Welcome to rami@profile. Type 'help' to see commands.\n");
  }

  function echo(text){
    termBody.innerText += text + '\n';
  }

  function typeOut(text, speed=8){
    let i=0;
    (function step(){
      if(i<text.length){ termBody.innerText += text[i++]; termBody.scrollTop = termBody.scrollHeight; setTimeout(step, speed); }
    })();
  }

  function handleCommand(cmd){
    const c = cmd.toLowerCase();
    if(c === 'help'){
      echo("Commands: about, experience, skills, certs, linkedin, clear");
      return;
    }
    if(c === 'clear'){ termBody.innerText = ''; return; }
    if(c === 'linkedin'){
      echo(content.linkedin);
      // open in new tab
      window.open('https://www.linkedin.com/in/rami-reddy-allam-423a47104/', '_blank');
      return;
    }
    if(content[c]){
      // simulate typing for longer entries
      typeOut(content[c] + '\n\n', 6);
      return;
    }
    echo("Command not found. Type 'help' for commands.");
  }

  // fallback for links in classic
  document.getElementById('link-classic').addEventListener('click', e=>{ e.preventDefault(); openClassic(); });
  document.getElementById('link-int').addEventListener('click', e=>{ e.preventDefault(); openInteractive(); });

})();
