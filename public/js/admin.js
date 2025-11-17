const baseUrl = 'https://padel-backend-ysw0.onrender.com';

// Verifica si hay token, si no, redirige al login
const token = localStorage.getItem('token');
if (!token) {
  alert('Token no encontrado. Inicia sesión nuevamente.');
  window.location.href = '/login.html';
}
// CREAR CLUB
document.getElementById('crearClubForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const club = {
    nombre: document.getElementById('nombre').value,
    direccion: document.getElementById('direccion').value,
    contacto_nombre: document.getElementById('contacto_nombre').value,
    contacto_telefono: document.getElementById('contacto_telefono').value,
    logo: document.getElementById('logo').value
  };

  const res = await fetch(`${baseUrl}/clubes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(club)
  });

  const data = await res.json();
  alert(data.message || 'Club creado');
  getClubes();
  cargarClubesSelect();
});

// LISTAR CLUBES
document.getElementById('verClubesBtn').addEventListener('click', getClubes);

async function getClubes() {
  const res = await fetch(`${baseUrl}/clubes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  let html = '<table border="1" cellpadding="5"><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>';
  data.forEach(club => {
    html += `<tr>
      <td>${club.id}</td>
      <td>${club.nombre}</td>
      <td><a href="/club/${club.id}" target="_blank">Ver página</a></td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('resultado').innerHTML = html;
}

// CARGAR CLUBES EN SELECT
async function cargarClubesSelect() {
  const res = await fetch(`${baseUrl}/clubes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  const select = document.getElementById('usuario_club');
  select.innerHTML = '<option value="">Selecciona un club</option>';
  data.forEach(club => {
    select.innerHTML += `<option value="${club.id}">${club.nombre}</option>`;
  });
}

// CREAR USUARIO ADMIN
document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = {
    nombre: document.getElementById('usuario_nombre').value,
    email: document.getElementById('usuario_email').value,
    password: document.getElementById('usuario_password').value,
    rol: 'CLUB_ADMIN',
    club_id: document.getElementById('usuario_club').value
  };

  const res = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(usuario)
  });

  const data = await res.json();
  alert(data.message || 'Usuario creado');
});

// Inicializa select de clubes al cargar la página
cargarClubesSelect();