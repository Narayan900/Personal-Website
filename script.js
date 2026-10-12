// Dark / light switch (remembers the choice, dark by default)
var themeBtn = document.getElementById('theme');
function syncTheme() {
  themeBtn.setAttribute('aria-checked', document.documentElement.classList.contains('light'));
}
syncTheme();
themeBtn.addEventListener('click', function () {
  var next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
  document.documentElement.className = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncTheme();
});

// Highlight the menu link for the section being read
var links = document.querySelectorAll('.topbar nav a');
var spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-20% 0px -65% 0px' });
document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });

document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- Hire Me form ----------
var dlg = document.getElementById('hireDialog');
var form = document.getElementById('hireForm');
var statusEl = document.getElementById('hireStatus');
var sendBtn = document.getElementById('hireSend');

document.querySelectorAll('[data-hire]').forEach(function (b) {
  b.addEventListener('click', function () {
    statusEl.textContent = ''; statusEl.className = '';
    dlg.showModal();
  });
});
document.getElementById('hireClose').addEventListener('click', function () { dlg.close(); });
dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // click outside closes

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var data = new FormData(form);

  if (String(data.get('access_key')).indexOf('PASTE_') === 0) {
    statusEl.className = 'err';
    statusEl.textContent = 'The form is not connected yet. Add your Web3Forms access key in index.html.';
    return;
  }

  sendBtn.disabled = true; sendBtn.textContent = 'Sending...';
  statusEl.className = ''; statusEl.textContent = '';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (res.success) {
        statusEl.className = 'ok';
        statusEl.textContent = 'Thank you! Your message was sent. I will reply to your email soon.';
        form.reset();
      } else {
        throw new Error(res.message || 'Failed');
      }
    })
    .catch(function () {
      statusEl.className = 'err';
      statusEl.textContent = 'Sorry, it did not send. Please WhatsApp me on +977 9863325627 or email narayanpokharel300@gmail.com.';
    })
    .finally(function () { sendBtn.disabled = false; sendBtn.textContent = 'Send'; });
});

// ---------- Floating WhatsApp chat ----------
var WA_NUMBER = '9779863325627';
var waWin = document.getElementById('waWin');
var waBtn = document.getElementById('waBtn');

function waToggle(open) {
  waWin.hidden = !open;
  waBtn.setAttribute('aria-expanded', String(open));
  if (open) {
    document.getElementById('waTime').textContent =
      new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    document.getElementById('waText').focus();
  }
}
waBtn.addEventListener('click', function () { waToggle(waWin.hidden); });
document.getElementById('waX').addEventListener('click', function () { waToggle(false); waBtn.focus(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !waWin.hidden) { waToggle(false); waBtn.focus(); }
});
document.getElementById('waForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var box = document.getElementById('waText');
  var msg = box.value.trim() || 'Hi Narayan, I saw your website.';
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  box.value = '';
  waToggle(false);
});
