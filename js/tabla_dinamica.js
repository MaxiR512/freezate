"use strict";

//-----------------------Tabla dinámica----------------------------

let BASE_API = "https://666237cd62966e20ef07ff14.mockapi.io/api/v1/recetas";
let PAGE_SIZE = 5; // number of items per page
let pagina_actual = 1; // current page number
let total_de_paginas = 1; // total number of pages
 
document.addEventListener('DOMContentLoaded', mostrarTabla); 
let cantidad = [];
let filas = [];

//----------------------funcion mostrar tabla-------------------
async function mostrarTabla() { 
    cuerpo_tabla.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif">`;
    try {
        let respuesta = await fetch(BASE_API)
        cantidad = await respuesta.json()
    }
    catch (error) {
        console.log("Error: " + error); 
    }
    try {
        let params = new URLSearchParams({
            'page': pagina_actual,
            'limit': PAGE_SIZE
        });
        let respuesta = await fetch(`${BASE_API}?${params}`);
        filas = await respuesta.json();
        cuerpo_tabla.innerHTML = "";
        for (let fila of filas) {
            cuerpo_tabla.innerHTML += `
      <tr>
        <td>${fila.nombre}</td>
        <td>${fila.telefono}</td>
        <td>${fila.correo}</td>
        <td>${fila.receta}</td>
        <td><button class="btnEdit" data-id="${fila.id}"><img src="./images/editar_fila.png" alt="Editar"></td>  
        <td><button class="btnEliminar" data-id="${fila.id}"><img src="./images/eliminar_fila.png" alt="Eliminar"></button></td>
      </tr>
      `;
        }
        let botonesEditar = document.querySelectorAll(".btnEdit");
        for (let btn of botonesEditar) {
            btn.addEventListener("click", initEditForm);
        }
        let botonesEliminar = document.querySelectorAll(".btnEliminar"); 
        for (let btn of botonesEliminar) {
            btn.addEventListener("click", eliminar);
        }

        total_de_paginas = Math.ceil(cantidad.length / PAGE_SIZE);
        actualizar_paginacion();
    }
    catch (error) {
        console.log("Error: " + error); 
    }
}

//----------------------actualiza paginación-------------------
function actualizar_paginacion() {
    let paginacion = `
            <button id="anterior" ${pagina_actual === 1 ? 'disabled' : ''}>Anterior</button>
            <span>Página ${pagina_actual} de ${total_de_paginas}</span>
            <button id="siguiente" ${pagina_actual === total_de_paginas ? 'disabled' : ''}>Siguiente</button>
    `;
    document.getElementById("paginacion").innerHTML = paginacion;
    document.getElementById("anterior").addEventListener("click", () => {
        pagina_actual--;
        mostrarTabla();
    });
    document.getElementById("siguiente").addEventListener("click", () => {
        pagina_actual++;
        mostrarTabla();
    });
}

//----------------------funcion enviar------------------
let btn_enviar = document.getElementById("btn-enviar"); 
btn_enviar.addEventListener("click", enviarDatos);
async function enviarDatos(evento) {
    evento.preventDefault();
    let nombreIngresado = document.getElementById("nombreyapellido").value;  
    let telefonoIngresado = document.getElementById("telefono").value;
    let correoIngresado = document.getElementById("correo").value;
    let recetaIngresada = document.getElementById("sugerencia").value;
    let renglon = {
        "nombre": nombreIngresado,
        "telefono": telefonoIngresado,
        "correo": correoIngresado,
        "receta": recetaIngresada
    }

    try {
        await fetch(BASE_API, {
            "method": "POST", 
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(renglon)
        })
        let respuestaNueva = await fetch(BASE_API, {
            "method": "GET" 
        })

        if (respuestaNueva.ok) {
            let datos = await respuestaNueva.json()
            cuerpo_tabla.innerHTML = ''; 
            mostrarTabla();
        }
        else {
            console.log("hubo un error"); 
        }
    }
    catch (error) {
        console.log("Error: " + error); 
    }

}
let btn_enviarX3 = document.getElementById("btn-enviarx3"); 
btn_enviarX3.addEventListener("click", async function(e){   
    console.log("Se agregaron tres");    
     for (let i=0; i<3; i++){
        setTimeout( await enviarDatos(e), 500); 
     }
});

//----------------------funcion eliminar------------------

async function eliminar(event) {
    event.preventDefault();
    let id = this.getAttribute("data-id");
    try {
        let respuesta = await fetch(BASE_API + "/" + id, {
            "method": "DELETE",
        });

        if (respuesta.ok) {
            console.log("Se Elimino con Exito!");
            await mostrarTabla();
        }
        else { console.log("fallo el borrar") }


    } catch (error) {
        console.log("Error: " + error); 
    }
}

//----------------------funcion inicializar form-------------------
function initEditForm(event) {
    event.preventDefault();
    try {
        edicion_formulario.classList.remove("oculto");
        edicion_formulario.classList.add("formulario_administrador");
        let idSeleccionado = this.dataset.id;
        let filaSeleccionada = filas.find(
            function (fila) {
                return fila.id == idSeleccionado
            })
        editar_id.value = filaSeleccionada.id
        editar_nombre.value = filaSeleccionada.nombre
        editar_telefono.value = filaSeleccionada.telefono
        editar_correo.value = filaSeleccionada.correo
        editar_receta.value = filaSeleccionada.receta

    }
    catch (error) {
        console.log("Error: " + error);
    }
}

//----------------------funcion modificar------------------
edicion_formulario.addEventListener("submit", modificar);
async function modificar(event) {
    event.preventDefault();
    let formData = new FormData(this) 
    let datos = {
        id: formData.get("id"),
        nombre: formData.get("nombre"),
        telefono: formData.get("telefono"),
        correo: formData.get("correo"),
        receta: formData.get("receta")
    }
    let respuesta = null; 

    try {
        respuesta = await fetch(BASE_API + "/" + formData.get("id"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })
    } catch (error) {
        console.log("Error" + error);
    }
    if (respuesta == null) {
        return;
    }

    console.log(respuesta.ok);
    edicion_formulario.classList.remove("formulario_administrador");
    edicion_formulario.classList.add("oculto");
    edicion_formulario.reset();

    await mostrarTabla();
}

//----------------------buscar en la tabla------------------

let inputBuscar = document.getElementById("input-buscar");
let selectColumna = document.getElementById("select-columna");
let tabla_dinamica = document.getElementById("cuerpo_tabla");

inputBuscar.addEventListener("input", filtrarFilas);
selectColumna.addEventListener("change", filtrarFilas);

function filtrarFilas() {
  let valorBuscar = inputBuscar.value.toLowerCase();
  let columnaSeleccionada = selectColumna.value;
  let filas = tabla_dinamica.rows;
    for (let i = 0; i < filas.length; i++) {
    let fila = filas[i];
    let celda = fila.cells[columnaSeleccionada];
    let textoCelda = celda.textContent.toLowerCase();

    if (valorBuscar && textoCelda.includes(valorBuscar)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  }
}
function buscarEnTabla() {
  let valorBuscar = inputBuscar.value.toLowerCase();
  let filas = tabla_dinamica.rows;

  for (let i = 0; i < filas.length; i++) {
    let fila = filas[i];
    let celdas = fila.cells;

    let mostrarFila = false;

    for (let j = 0; j < celdas.length; j++) {
      let celda = celdas[j];
      let textoCelda = celda.textContent.toLowerCase();

      if (textoCelda.includes(valorBuscar)) {
        mostrarFila = true;
        break;
      }
    }

    fila.style.display = mostrarFila ? '' : 'none';
  }
}