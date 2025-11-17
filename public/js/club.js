// public/club.js
let token = null;

document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById('verClubBtn').style.display = 'inline';
    alert('Login exitoso');
  } else {
    alert('Login fallido');
  }
};

document.getElementById('verClubBtn').onclick = async function() {
  const res = await fetch('/clubes/1', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById('clubInfo').textContent = JSON.stringify(data, null, 2);
};