// Ver lista de clubes
document.getElementById('verClubesBtn').addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/clubes', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const clubes = await response.json();
  // Aquí podrías mostrar los clubes en el HTML, por ahora solo en consola:
  console.log(clubes);
});

// Crear club
document.getElementById('crearClubBtn').addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const nombre = document.getElementById('nombreClub').value;
  const direccion = document.getElementById('direccionClub').value;
  const contacto = document.getElementById('contactoClub').value;
  const telefono = document.getElementById('telefonoClub').value;
  const logo = document.getElementById('logoClub').value;

  const response = await fetch('/clubes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre,
      direccion,
      contacto,
      telefono,
      logo
    })
  });
  const result = await response.json();
  // Muestra el resultado en consola o en el HTML
  console.log(result);
});

// Crear usuario administrador
document.getElementById('crearUsuarioBtn').addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const nombre = document.getElementById('nombreUsuario').value;
  const email = document.getElementById('emailUsuario').value;
  const password = document.getElementById('passwordUsuario').value;
  const clubId = document.getElementById('clubesSelect').value;

  const response = await fetch('/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre,
      email,
      password,
      club_id: clubId,
      rol: 'admin'
    })
  });
  const result = await response.json();
  // Muestra el resultado en consola o en el HTML
  console.log(result);
});
