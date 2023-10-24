let idMascotaEditar;

function crearMascota() {
  let nombre_mas = document.getElementById("inputNombre").value;
  let edad_mas = document.getElementById("inputEdad").value;
  let raza_mas = document.getElementById("inputRaza").value;
  let codigo_sexo = document.getElementById("inputSexo").value;

  // Recolectando los datos para enviar al backend.
  let datos = { nombre_mas, edad_mas, raza_mas, codigo_sexo };
  
  console.log(nombre_mas, edad_mas, raza_mas, codigo_sexo);

  if (nombre_mas != "" && edad_mas != "" && raza_mas != "" && codigo_sexo != "") {
      const llamadaHttp = async function () {
          const respuesta = await fetch("/mascotas/crear", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(datos)
          });
          const respuestaJson = await respuesta.json();

          if (respuestaJson.exito) {
              alert("Mascota creada exitosamente!");
              limpiarCampos();
              mostrarMascotas();
          } else {
              alert("Hubo un problema creando la mascota.")
          }
      }
      llamadaHttp();
  } else {
      alert("Algún campo está vacío");
  }
}

async function mostrarMascotas() {
  const respuesta = await fetch("/mascotas/", {
      method: "GET",
  });
  const respuestaJson = await respuesta.json();

  if (respuestaJson.exito) {
      if (document.getElementById("contenedorMascotas")) {
          document.getElementById("contenedorMascotas").remove();
      }

      let contenedorMascotas = document.createElement("table");
      contenedorMascotas.id = "contenedorMascotas";

      // Crear encabezado de tabla
      let encabezado = contenedorMascotas.createTHead();
      let filaEncabezado = encabezado.insertRow();
      let celdaEncabezadoId_mas = filaEncabezado.insertCell();
      let celdaEncabezadoNombre_mas = filaEncabezado.insertCell();
      let celdaEncabezadoEdad_mas = filaEncabezado.insertCell();
      let celdaEncabezadoRaza_mas = filaEncabezado.insertCell();
      let celdaEncabezadoCodigo_sexo = filaEncabezado.insertCell();
      let celdaEncabezadoAcciones = filaEncabezado.insertCell();
      celdaEncabezadoId_mas.innerHTML = "ID";
      celdaEncabezadoNombre_mas.innerHTML = "NOMBRE";
      celdaEncabezadoEdad_mas.innerHTML = "EDAD";
      celdaEncabezadoRaza_mas.innerHTML = "RAZA";
      celdaEncabezadoCodigo_sexo.innerHTML = "SEXO";
      celdaEncabezadoAcciones.innerHTML = "ACCIONES";

      // Agregar filas de mascotas
      for (let i = 0; i < respuestaJson.lista.length; i++) {
          let mascotas = respuestaJson.lista[i];
          let fila = contenedorMascotas.insertRow();
          let celdaID = fila.insertCell();
          let celdaNombre = fila.insertCell();
          let celdaEdad = fila.insertCell();
          let celdaRaza = fila.insertCell();
          let celdaSexo = fila.insertCell();
          let celdaAcciones = fila.insertCell();
          celdaID.innerText = mascotas.id_mas;
          celdaNombre.innerText = mascotas.nombre_mas;
          celdaEdad.innerText = mascotas.edad_mas;
          celdaRaza.innerText = mascotas.raza_mas;
          celdaSexo.innerText = mascotas.codigo_sexo;
          
          // Botón de editar
          let botonEditar = document.createElement("button");
          botonEditar.innerText = "Editar";
          botonEditar.addEventListener("click", function () {
              mostrarFormularioEditar(mascotas);
          });
          celdaAcciones.appendChild(botonEditar);
      }

      document.getElementById("lista-mascotas").append(contenedorMascotas);
  }
}

mostrarMascotas();

function mostrarFormularioEditar(mascotas) {
  idMascotaEditar = mascotas.id_mas;
  document.getElementById("inputNombre").value = mascotas.nombre_mas;
  document.getElementById("inputEdad").value = mascotas.edad_mas;
  document.getElementById("inputRaza").value = mascotas.raza_mas;
  document.getElementById("inputSexo").value = mascotas.codigo_sexo;
  document.getElementById("formularioEditar").style.display = "block";
}

async function actualizarMascota() {
  const id_mas = idMascotaEditar;
  const nombre_mas = document.getElementById("inputNombre").value;
  const edad_mas = document.getElementById("inputEdad").value;
  const raza_mas = document.getElementById("inputRaza").value;
  const codigo_sexo = document.getElementById("inputSexo").value;

  const respuesta = await fetch(`/mascotas/${id_mas}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_mas, edad_mas, raza_mas, codigo_sexo }),
  });
  const respuestaRecibida = await respuesta.json();

  if (respuestaRecibida.exito) {
      document.getElementById("formularioEditar").style.display = "none";
      mostrarMascotas();
  } else {
      alert("Hubo un error al editar la mascota");
  }
}

botonEliminar.addEventListener("click", function () {
  if (confirm("¿Está seguro de eliminar esta mascota?")) {
      eliminarMascota(idMascotaEditar);
  }
});

function eliminarMascota(id_mas) {
  fetch(`/mascotas/${id_mas}`, {
      method: "DELETE"
  })
  .then(response => response.json())
  .then(data => {
      if (data.exito) {
          alert("Mascota eliminada exitosamente");
          mostrarMascotas();
      } else {
          alert(data.mensaje);
      }
  })
  .catch(err => {
      console.error(err);
      alert("Error al eliminar la mascota");
  });
}

// Botón de Limpiar Campos
botonLimpiar.addEventListener("click", function () {
  if (confirm("¿Está seguro que desea limpiar los campos?")) {
      limpiarCampos();
  }
});

function limpiarCampos(){
  let nombre_mas = document.getElementById("inputNombre").value ="";
  let edad_mas = document.getElementById("inputEdad").value ="";
  let raza_mas = document.getElementById("inputRaza").value ="";
  let codigo_sexo = document.getElementById("inputSexo").value ="";
}