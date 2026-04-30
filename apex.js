/* ══════════════════════════════════════════════
   APEX GYM — script.js
   Full functionality: Auth, Payment, Schedule,
   Filters, Counters, Animations, Theme & Lang
══════════════════════════════════════════════ */

/* ── USERS STORE (localStorage) ── */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('apexUsers') || '[]'); }
  catch (e) { return []; }
}
function saveUsers(u) {
  try { localStorage.setItem('apexUsers', JSON.stringify(u)); }
  catch (e) { }
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('apexCurrentUser') || 'null'); }
  catch (e) { return null; }
}
function setCurrentUser(u) {
  try { localStorage.setItem('apexCurrentUser', JSON.stringify(u)); }
  catch (e) { }
}

/* ── PAGE LOAD ── */
window.addEventListener('load', function () {
  // Hide loader after 1.8s
  setTimeout(function () {
    var loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);

  // Restore logged-in user
  var user = getCurrentUser();
  if (user) updateNavForUser(user.name);

  // Init schedule (Monday default)
  var monBtn = document.querySelector('.tab-btn');
  if (monBtn) showDay(monBtn, 'mon');

  // Init scroll animations
  initReveal();

  // Init counters
  initCounters();
});

/* ── THEME TOGGLE ── */
var currentTheme = 'dark';
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.getElementById('themeIcon').textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  document.getElementById('themeLabel').textContent = currentTheme === 'dark' ? 'Light' : 'Dark';
}

/* ── LANGUAGE TOGGLE ── */
var currentLang = 'en';
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ur' : 'en';
  document.getElementById('langLabel').textContent = currentLang === 'en' ? 'اردو' : 'English';

  if (currentLang === 'ur') {
    document.documentElement.setAttribute('lang-mode', 'ur');
    document.documentElement.setAttribute('lang', 'ur');
  } else {
    document.documentElement.removeAttribute('lang-mode');
    document.documentElement.setAttribute('lang', 'en');
  }

  // Update all translatable elements
  document.querySelectorAll('[data-en]').forEach(function (el) {
    var key = 'data-' + currentLang;
    var val = el.getAttribute(key);
    if (val) el.textContent = val;
  });
}

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  var backTop = document.getElementById('backTop');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
});

/* ── MOBILE MENU ── */
var hamburger = document.getElementById('hamburger');
var closeMenuBtn = document.getElementById('closeMenu');
if (hamburger) hamburger.addEventListener('click', function () {
  document.getElementById('mobileMenu').classList.add('open');
});
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

/* ── CUSTOM CURSOR ── */
var cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.addEventListener('mousedown', function () {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
  });
  document.addEventListener('mouseup', function () {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
  });
}

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}

/* ── ANIMATED COUNTERS ── */
function initCounters() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.dataset.target);
        var step = Math.ceil(target / 60);
        var count = 0;
        var timer = setInterval(function () {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = count.toLocaleString();
        }, 25);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(function (el) {
    obs.observe(el);
  });
}

/* ── EXERCISE FILTER ── */
function filterEx(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  document.querySelectorAll('.exercise-card').forEach(function (card) {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ── CLASS SCHEDULE DATA ── */
var scheduleData = {
  mon: [
    ['6:00 AM', 'Powerlifting', 'Marcus Steel', '60 Min', 'All Levels', '8/20'],
    ['8:00 AM', 'HIIT Burn', 'Jake Rivers', '45 Min', 'Intermediate', '12/15'],
    ['10:00 AM', 'Power Yoga', 'Sofia Reyes', '75 Min', 'All Levels', '15/20'],
    ['12:00 PM', 'Boxing Basics', 'Coach Lee', '60 Min', 'Beginner', '10/12'],
    ['5:00 PM', 'CrossFit WOD', 'Jake Rivers', '60 Min', 'Advanced', '6/10'],
    ['7:00 PM', 'Spin Class', 'Coach Mia', '45 Min', 'All Levels', '18/20']
  ],
  tue: [
    ['7:00 AM', 'Morning HIIT', 'Jake Rivers', '45 Min', 'All Levels', '14/15'],
    ['9:00 AM', 'Pilates Core', 'Sofia Reyes', '60 Min', 'Beginner', '12/15'],
    ['11:00 AM', 'Strength Circuit', 'Marcus Steel', '60 Min', 'Intermediate', '8/12'],
    ['3:00 PM', 'Calisthenics', 'Coach Ava', '45 Min', 'All Levels', '10/15'],
    ['6:00 PM', 'Kickboxing', 'Coach Lee', '60 Min', 'All Levels', '10/15'],
    ['8:00 PM', 'Yoga Restore', 'Sofia Reyes', '75 Min', 'All Levels', '16/20']
  ],
  wed: [
    ['6:00 AM', 'Powerlifting', 'Marcus Steel', '60 Min', 'Advanced', '5/10'],
    ['9:00 AM', 'HIIT Cardio', 'Jake Rivers', '45 Min', 'All Levels', '11/15'],
    ['11:00 AM', 'Barre Fusion', 'Coach Ava', '60 Min', 'Beginner', '14/15'],
    ['5:30 PM', 'CrossFit WOD', 'Jake Rivers', '60 Min', 'Advanced', '7/10'],
    ['7:30 PM', 'Nutrition Workshop', 'Aria Chen', '90 Min', 'All Levels', '20/25']
  ],
  thu: [
    ['7:00 AM', 'Full Body Burn', 'Jake Rivers', '60 Min', 'Intermediate', '13/15'],
    ['10:00 AM', 'Hatha Yoga', 'Sofia Reyes', '75 Min', 'Beginner', '15/20'],
    ['12:00 PM', 'Boxing Advanced', 'Coach Lee', '60 Min', 'Advanced', '8/12'],
    ['4:00 PM', 'MMA Fundamentals', 'Coach Lee', '90 Min', 'Intermediate', '8/12'],
    ['6:00 PM', 'Strength & Power', 'Marcus Steel', '60 Min', 'Intermediate', '9/12'],
    ['8:00 PM', 'Stretch & Recover', 'Dr. Hassan', '60 Min', 'All Levels', '12/15']
  ],
  fri: [
    ['6:00 AM', 'Sunrise Yoga', 'Sofia Reyes', '60 Min', 'All Levels', '16/20'],
    ['8:00 AM', 'HIIT Friday', 'Jake Rivers', '45 Min', 'Intermediate', '15/15'],
    ['10:00 AM', 'Powerlifting', 'Marcus Steel', '60 Min', 'Advanced', '6/10'],
    ['2:00 PM', 'TRX Suspension', 'Coach Ava', '40 Min', 'Intermediate', '10/12'],
    ['5:00 PM', 'CrossFit WOD', 'Jake Rivers', '60 Min', 'Advanced', '8/10'],
    ['7:00 PM', 'Dance Cardio', 'Coach Mia', '45 Min', 'All Levels', '18/20']
  ],
  sat: [
    ['8:00 AM', 'Weekend Warriors', 'Marcus Steel', '90 Min', 'All Levels', '15/20'],
    ['10:00 AM', 'Power Yoga', 'Sofia Reyes', '75 Min', 'All Levels', '18/20'],
    ['12:00 PM', 'Boxing Sparring', 'Coach Lee', '60 Min', 'Intermediate', '8/12'],
    ['2:00 PM', 'HIIT Challenge', 'Jake Rivers', '60 Min', 'Advanced', '10/15'],
    ['4:00 PM', 'Zumba Party', 'Coach Mia', '60 Min', 'All Levels', 'Open']
  ],
  sun: [
    ['9:00 AM', 'Active Recovery', 'Dr. Hassan', '60 Min', 'All Levels', '20/25'],
    ['11:00 AM', 'Open Gym Session', 'Staff', '120 Min', 'All Levels', 'Open'],
    ['2:00 PM', 'Meditation & Breathwork', 'Sofia Reyes', '45 Min', 'All Levels', '15/20'],
    ['4:00 PM', 'Family Fitness', 'Multiple', '60 Min', 'All Levels', 'Open']
  ]
};

function showDay(btn, day) {
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');

  var tbody = document.getElementById('scheduleBody');
  var rows = scheduleData[day] || [];

  tbody.innerHTML = rows.map(function (r) {
    var spotsColor = r[5] === 'Open' ? 'var(--gold)'
      : parseInt(r[5]) <= 2 ? '#e74c3c'
        : 'var(--light-grey)';
    return '<tr>'
      + '<td><strong>' + r[0] + '</strong></td>'
      + '<td><span class="class-pill">' + r[1] + '</span></td>'
      + '<td>' + r[2] + '</td>'
      + '<td>' + r[3] + '</td>'
      + '<td>' + r[4] + '</td>'
      + '<td style="color:' + spotsColor + '">' + r[5] + '</td>'
      + '</tr>';
  }).join('');
}

/* ── AUTH MODAL ── */
function openAuth(tab) {
  document.getElementById('authModal').classList.add('open');
  switchTab(tab);
}
function closeAuth() {
  document.getElementById('authModal').classList.remove('open');
  clearMessages();
}

var authModal = document.getElementById('authModal');
if (authModal) {
  authModal.addEventListener('click', function (e) {
    if (e.target === this) closeAuth();
  });
}

function switchTab(tab) {
  clearMessages();
  ['login', 'register'].forEach(function (t) {
    document.getElementById(t + 'Tab').classList.toggle('active', t === tab);
    document.getElementById(t + 'Form').classList.toggle('active', t === tab);
  });
}

function clearMessages() {
  ['loginError', 'loginSuccess', 'regError', 'regSuccess'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

function showMsg(id, msg) {
  var el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function togglePwd(inputId, icon) {
  var input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁';
  }
}

function checkStrength(pw) {
  var fill = document.getElementById('strengthFill');
  var label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  var score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  var configs = [
    { pct: '0%', color: '', text: '' },
    { pct: '25%', color: '#e74c3c', text: 'Weak' },
    { pct: '50%', color: '#f39c12', text: 'Fair' },
    { pct: '75%', color: '#3498db', text: 'Good' },
    { pct: '100%', color: '#2ecc71', text: 'Strong' }
  ];

  var c = configs[score];
  fill.style.width = c.pct;
  fill.style.background = c.color;
  label.textContent = c.text;
  label.style.color = c.color;
}

function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function handleLogin() {
  clearMessages();
  var email = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showMsg('loginError', 'Please enter your email and password.');
    return;
  }
  if (!validateEmail(email)) {
    showMsg('loginError', 'Please enter a valid email address.');
    return;
  }

  var users = getUsers();
  var user = users.find(function (u) {
    return u.email.toLowerCase() === email.toLowerCase() && u.password === password;
  });

  if (!user) {
    showMsg('loginError', 'Invalid email or password. Please try again.');
    return;
  }

  setCurrentUser({ name: user.firstName, email: user.email });
  showMsg('loginSuccess', 'Welcome back, ' + user.firstName + '! Redirecting...');
  setTimeout(function () {
    closeAuth();
    updateNavForUser(user.firstName);
  }, 1500);
}

function handleRegister() {
  clearMessages();
  var first = document.getElementById('regFirst').value.trim();
  var last = document.getElementById('regLast').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var phone = document.getElementById('regPhone').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;
  var agreed = document.getElementById('agreeTerms').checked;

  if (!first || !last || !email || !phone || !password || !confirm) {
    showMsg('regError', 'Please fill in all fields.');
    return;
  }
  if (!validateEmail(email)) {
    showMsg('regError', 'Please enter a valid email address.');
    return;
  }
  if (password.length < 8) {
    showMsg('regError', 'Password must be at least 8 characters long.');
    return;
  }
  if (password !== confirm) {
    showMsg('regError', 'Passwords do not match.');
    return;
  }
  if (!agreed) {
    showMsg('regError', 'Please agree to the Terms of Service and Privacy Policy.');
    return;
  }

  var users = getUsers();
  var exists = users.find(function (u) {
    return u.email.toLowerCase() === email.toLowerCase();
  });
  if (exists) {
    showMsg('regError', 'An account with this email already exists.');
    return;
  }

  var newUser = {
    firstName: first,
    lastName: last,
    email: email,
    phone: phone,
    password: password,
    joined: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser({ name: first, email: email });

  showMsg('regSuccess', '🎉 Welcome to APEX, ' + first + '! Your account has been created.');
  setTimeout(function () {
    closeAuth();
    updateNavForUser(first);
  }, 2000);
}

function updateNavForUser(name) {
  var cta = document.getElementById('navCta');
  if (cta) {
    cta.innerHTML =
      '<span style="font-family:var(--font-cond);font-size:13px;color:var(--gold);letter-spacing:1px;">👋 ' + name + '</span>'
      + '<button class="btn btn-outline" onclick="logoutUser()" style="padding:10px 20px;font-size:12px;">Sign Out</button>';
  }
}

function logoutUser() {
  try { localStorage.removeItem('apexCurrentUser'); } catch (e) { }
  var cta = document.getElementById('navCta');
  if (cta) {
    cta.innerHTML =
      '<button class="btn btn-outline" onclick="openAuth(\'login\')" style="padding:10px 20px;font-size:12px;">Sign In</button>'
      + '<button class="btn btn-gold" onclick="openAuth(\'register\')" style="padding:10px 20px;font-size:12px;">Join Now</button>';
  }
}

function forgotPassword(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showMsg('loginError', 'Enter your email above first, then click Forgot Password.');
    return;
  }
  if (!validateEmail(email)) {
    showMsg('loginError', 'Please enter a valid email address.');
    return;
  }
  showMsg('loginSuccess', 'Password reset link sent to ' + email + '. (Demo only)');
}

/* ── PAYMENT MODAL ── */
var selectedPlan = '';
var selectedAmt = '';

function openPayment(plan, amt) {
  selectedPlan = plan;
  selectedAmt = amt;

  document.getElementById('payPlanBadge').textContent = plan + ' Plan';
  document.getElementById('payAmount').innerHTML =
    'PKR ' + amt + '<span style="font-size:20px;color:var(--grey)">/mo</span>';
  document.getElementById('payBtnAmount').textContent = amt;
  document.getElementById('paymentFormSection').style.display = 'block';
  document.getElementById('paymentSuccess').style.display = 'none';
  document.getElementById('payError').style.display = 'none';

  // Clear all payment fields
  ['payFirst', 'payLast', 'payEmail', 'payPhone', 'payCity', 'payCard', 'payExpiry', 'payCvv', 'payName'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('payBank').value = '';

  document.getElementById('paymentModal').classList.add('open');
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('open');
}

var paymentModal = document.getElementById('paymentModal');
if (paymentModal) {
  paymentModal.addEventListener('click', function (e) {
    if (e.target === this) closePayment();
  });
}

function formatCard(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1  ').trim();
}

function formatExpiry(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

function submitPayment() {
  var err = document.getElementById('payError');
  var first = document.getElementById('payFirst').value.trim();
  var last = document.getElementById('payLast').value.trim();
  var email = document.getElementById('payEmail').value.trim();
  var phone = document.getElementById('payPhone').value.trim();
  var bank = document.getElementById('payBank').value;
  var card = document.getElementById('payCard').value.replace(/\s/g, '');
  var expiry = document.getElementById('payExpiry').value.trim();
  var cvv = document.getElementById('payCvv').value.trim();
  var name = document.getElementById('payName').value.trim();

  if (!first || !last || !email || !phone || !bank || card.length < 15 || expiry.length < 4 || cvv.length < 3 || !name) {
    err.style.display = 'block';
    err.textContent = 'Please fill in all fields with valid information.';
    return;
  }
  if (!validateEmail(email)) {
    err.style.display = 'block';
    err.textContent = 'Please enter a valid email address.';
    return;
  }

  err.style.display = 'none';
  document.getElementById('successPlan').textContent = selectedPlan;
  document.getElementById('paymentFormSection').style.display = 'none';
  document.getElementById('paymentSuccess').style.display = 'block';
}

/* ── BOOKING FORM ── */
function submitBooking() {
  var err = document.getElementById('bookingError');
  var first = document.getElementById('bFirstName').value.trim();
  var last = document.getElementById('bLastName').value.trim();
  var email = document.getElementById('bEmail').value.trim();
  var phone = document.getElementById('bPhone').value.trim();
  var service = document.getElementById('bService').value;
  var date = document.getElementById('bDate').value;

  if (!first || !last || !email || !phone || !service || !date) {
    err.style.display = 'block';
    err.textContent = 'Please fill in all required fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.style.display = 'block';
    err.textContent = 'Please enter a valid email address.';
    return;
  }

  err.style.display = 'none';
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = this.getAttribute('href');
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── KEYBOARD (ESC to close modals) ── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeAuth();
    closePayment();
    closeMobileMenu();
  }
});