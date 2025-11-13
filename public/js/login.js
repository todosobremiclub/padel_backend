document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://tu-backend-url.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      // Redirigir al panel admin
      window.location.href = '/admin.html';
    } else {
      document.getElementById('errorMsg').textContent = data.message || 'Error en login';
    }
  } catch (error) {
    document.getElementById('errorMsg').textContent = 'Error de conexión';
  }
});
