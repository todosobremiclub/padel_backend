const baseUrl = 'https://padel-backend-ysw0.onrender.com';

// Verifica si hay token, si no, redirige al login
const token = localStorage.getItem('token');
if (!token) {
  alert('Token no encontrado. Inicia sesión nuevamente.');
  window.location.href = '/login.html';
}

// Función para manejar errores de fetch
function handleFetchError(res) {
  if (res.status === 403) {
    alert('Acceso prohibido (403). Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.');
    window.location.href = '/login.html';
    return true;
  }
  if (!res.ok) {
    alert('Error en la petición: ' + res.status);
    return true;
  }
  return false;
}

// CREAR CLUB
document.getElementById('crearClubForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validación básica
  const nombre = document.getElementById('nombre').value.trim();
  if (!nombre) {
    alert('El nombre del club es obligatorio');
    return;
  }

  const club = {
    nombre,
    direccion: document.getElementById('direccion').value.trim(),
    contacto_nombre: document.getElementById('contacto_nombre').value.trim(),
    contacto_telefono: document.getElementById('contacto_telefono').value.trim(),
    logo_url: document.getElementById('logo').value.trim(),
    color_principal: document.getElementById('color_principal').value.trim(),
    color_secundario: document.getElementById('color_secundario').value.trim(),
    fondo_url: document.getElementById('fondo_url').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim()
  };

  try {
    const res = await fetch(`${baseUrl}/clubes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(club)
    });

    if (handleFetchError(res)) return;

    const data = await res.json();
    alert(data.message || 'Club creado');
    await getClubes();
    await cargarClubesSelect();
  } catch (error) {
    alert('Hubo un problema: ' + error.message);
  }
});

// LISTAR CLUBES
document.getElementById('verClubesBtn').addEventListener('click', getClubes);

async function getClubes() {
  try {
    const res = await fetch(`${baseUrl}/clubes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (handleFetchError(res)) return;

    const data = await res.json();
    if (!Array.isArray(data)) {
      alert('No se pudo obtener la lista de clubes.');
      return;
    }

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
  } catch (error) {
    alert('Hubo un problema al listar clubes: ' + error.message);
  }
}

// CARGAR CLUBES EN SELECT
async function cargarClubesSelect() {
  try {
    const res = await fetch(`${baseUrl}/clubes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (handleFetchError(res)) return;

    const data = await res.json();
    const select = document.getElementById('usuario_club');
    select.innerHTML = '<option value="">Selecciona un club</option>';
    if (Array.isArray(data)) {
      data.forEach(club => {
        select.innerHTML += `<option value="${club.id}">${club.nombre}</option>`;
      });
    }
  } catch (error) {
    alert('Hubo un problema al cargar clubes: ' + error.message);
  }
}

// CREAR USUARIO ADMIN
document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validación básica
  const nombre = document.getElementById('usuario_nombre').value.trim();
  const email = document.getElementById('usuario_email').value.trim();
  const password = document.getElementById('usuario_password').value.trim();
  const club_id = document.getElementById('usuario_club').value;

  if (!nombre || !email || !password || !club_id) {
    alert('Todos los campos son obligatorios para crear el usuario.');
    return;
  }

  const usuario = {
    nombre,
    email,
    password,
    rol: 'ClubAdmin',
    club_id
  };

  try {
    const res = await fetch(`${baseUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuario)
    });

    if (handleFetchError(res)) return;

    const data = await res.json();
    alert(data.message || 'Usuario creado');
  } catch (error) {
    alert('Hubo un problema al crear el usuario: ' + error.message);
  }
});

// Inicializa select de clubes al cargar la página
cargarClubesSelect();

// Botón para ir a la página del club
document.getElementById('verPaginaBtn').onclick = function() {
  window.location.href = 'club.html';
};