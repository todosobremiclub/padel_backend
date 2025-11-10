// LOGIN: obtiene token y lo guarda
async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    alert('Login exitoso');
  } else {
    alert('Error en login');
  }
}

// EJEMPLO: obtener lista de clubes con token
async function getClubes() {
  const token = localStorage.getItem('token');
  const res = await fetch('/clubes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  console.log(data);
}
