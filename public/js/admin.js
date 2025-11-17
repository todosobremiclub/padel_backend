const baseUrl = 'https://padel-backend-ysw0.onrender.com';

// Verifica si hay token, si no, redirige al login
const token = localStorage.getItem('token');
if (!token) {
  alert('Token no encontrado. Inicia sesión nuevamente.');
  window.location.href = '/login.html';
}

// Manejo de errores de fetch
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

// ==================== CLUBES ====================

// Crear club
document.getElementById('crearClubForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const club = {
    nombre: document.getElementById('nombre').value.trim(),
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
    alert('Club creado');
    getClubes();
    cargarClubesSelect();
    e.target.reset();
  } catch (error) {
    alert('Hubo un problema: ' + error.message);
  }
});

// Listar clubes
document.getElementById('verClubesBtn').addEventListener('click', getClubes);
async function getClubes() {
  try {
    const res = await fetch(`${baseUrl}/clubes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (handleFetchError(res)) return;
    const data = await res.json();
    let html = '<table border="1" cellpadding="5"><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>';
    data.forEach(club => {
      html += `<tr>
        <td>${club.id}</td>
        <td>${club.nombre}</td>
        <td>
          <a href="/club/${club.id}" target="_blank">Ver página</a>
          <button onclick="mostrarEditarClub(${club.id}, '${club.nombre}', '${club.direccion || ''}', '${club.contacto_nombre || ''}', '${club.contacto_telefono || ''}', '${club.logo_url || ''}', '${club.descripcion || ''}')">Editar</button>
          <button onclick="eliminarClub(${club.id})">Eliminar</button>
        </td>
      </tr>`;
    });
    html += '</table>';
    document.getElementById('resultado').innerHTML = html;
  } catch (error) {
    alert('Hubo un problema al listar clubes: ' + error.message);
  }
}

// Mostrar formulario para editar club
window.mostrarEditarClub = function(id, nombre, direccion, contacto_nombre, contacto_telefono, logo_url, descripcion) {
  cancelarEdicionClub();
  document.getElementById('resultado').innerHTML += `
    <div id="editarClubForm" style="margin-top:10px; border:1px solid #ccc; padding:10px;">
      <h4>Editar Club</h4>
      <input type="text" id="editClubNombre" value="${nombre}" placeholder="Nombre"><br>
      <input type="text" id="editClubDireccion" value="${direccion}" placeholder="Dirección"><br>
      <input type="text" id="editClubContactoNombre" value="${contacto_nombre}" placeholder="Nombre de contacto"><br>
      <input type="text" id="editClubContactoTelefono" value="${contacto_telefono}" placeholder="Teléfono de contacto"><br>
      <input type="text" id="editClubLogo" value="${logo_url}" placeholder="URL del logo"><br>
      <textarea id="editClubDescripcion" placeholder="Descripción">${descripcion}</textarea><br>
      <button onclick="guardarEdicionClub(${id})">Guardar</button>
      <button onclick="cancelarEdicionClub()">Cancelar</button>
    </div>
  `;
}

window.guardarEdicionClub = async function(id) {
  const nombre = document.getElementById('editClubNombre').value;
  const direccion = document.getElementById('editClubDireccion').value;
  const contacto_nombre = document.getElementById('editClubContactoNombre').value;
  const contacto_telefono = document.getElementById('editClubContactoTelefono').value;
  const logo_url = document.getElementById('editClubLogo').value;
  const descripcion = document.getElementById('editClubDescripcion').value;
  try {
    const res = await fetch(`${baseUrl}/clubes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, direccion, contacto_nombre, contacto_telefono, logo_url, descripcion })
    });
    if (handleFetchError(res)) return;
    alert('Club actualizado');
    cancelarEdicionClub();
    getClubes();
    cargarClubesSelect();
  } catch (error) {
    alert('Error al actualizar club: ' + error.message);
  }
}

window.cancelarEdicionClub = function() {
  const form = document.getElementById('editarClubForm');
  if (form) form.remove();
}

window.eliminarClub = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar este club?')) return;
  try {
    const res = await fetch(`${baseUrl}/clubes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (handleFetchError(res)) return;
    alert('Club eliminado');
    getClubes();
    cargarClubesSelect();
  } catch (error) {
    alert('Error al eliminar club: ' + error.message);
  }
}

// Cargar clubes en el select de usuarios
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

// ==================== USUARIOS ====================

// Crear usuario
document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = {
    nombre: document.getElementById('usuario_nombre').value.trim(),
    email: document.getElementById('usuario_email').value.trim(),
    password: document.getElementById('usuario_password').value.trim(),
    rol: 'ClubAdmin',
    club_id: document.getElementById('usuario_club').value
  };
  if (!usuario.nombre || !usuario.email || !usuario.password || !usuario.club_id) {
    alert('Todos los campos son obligatorios para crear el usuario.');
    return;
  }
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
    alert('Usuario creado');
    getUsuarios();
    e.target.reset();
  } catch (error) {
    alert('Hubo un problema al crear el usuario: ' + error.message);
  }
});

// Listar usuarios
async function getUsuarios() {
  try {
    const res = await fetch(`${baseUrl}/usuarios`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (handleFetchError(res)) return;
    const data = await res.json();
    let html = '<h3>Lista de Usuarios</h3><table border="1" cellpadding="5"><tr><th>ID</th><th>Usuario</th><th>Club</th><th>Acciones</th></tr>';
    data.forEach(usuario => {
      html += `<tr>
        <td>${usuario.id}</td>
        <td>${usuario.email}</td>
        <td>${usuario.club || ''}</td>
        <td>
          <button onclick="mostrarEditarUsuario(${usuario.id}, '${usuario.nombre}', '${usuario.email}', '${usuario.club || ''}')">Editar</button>
          <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
        </td>
      </tr>`;
    });
    html += '</table>';
    document.getElementById('usuariosResultado').innerHTML = html;
  } catch (error) {
    alert('Hubo un problema al listar usuarios: ' + error.message);
  }
}

// Mostrar formulario para editar usuario
window.mostrarEditarUsuario = function(id, nombre, email, club) {
  cancelarEdicionUsuario();
  document.getElementById('usuariosResultado').innerHTML += `
    <div id="editarUsuarioForm" style="margin-top:10px; border:1px solid #ccc; padding:10px;">
      <h4>Editar Usuario</h4>
      <input type="text" id="editNombre" value="${nombre}" placeholder="Nombre"><br>
      <input type="email" id="editEmail" value="${email}" placeholder="Email"><br>
      <input type="password" id="editPassword" placeholder="Nueva contraseña (opcional)"><br>
      <button onclick="guardarEdicionUsuario(${id})">Guardar</button>
      <button onclick="cancelarEdicionUsuario()">Cancelar</button>
    </div>
  `;
}

window.guardarEdicionUsuario = async function(id) {
  const nombre = document.getElementById('editNombre').value;
  const email = document.getElementById('editEmail').value;
  const password = document.getElementById('editPassword').value;
  try {
    const res = await fetch(`${baseUrl}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, email, password })
    });
    if (handleFetchError(res)) return;
    alert('Usuario actualizado');
    cancelarEdicionUsuario();
    getUsuarios();
  } catch (error) {
    alert('Error al actualizar usuario: ' + error.message);
  }
}

window.cancelarEdicionUsuario = function() {
  const form = document.getElementById('editarUsuarioForm');
  if (form) form.remove();
}

window.eliminarUsuario = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    const res = await fetch(`${baseUrl}/usuarios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (handleFetchError(res)) return;
    alert('Usuario eliminado');
    getUsuarios();
  } catch (error) {
    alert('Error al eliminar usuario: ' + error.message);
  }
}

// ==================== INICIALIZACIÓN ====================

cargarClubesSelect();
getClubes();
getUsuarios();

// Botón para ir a la página del club
document.getElementById('verPaginaBtn').onclick = function() {
  window.location.href = 'club.html';
};
