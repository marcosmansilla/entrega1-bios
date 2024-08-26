//Primer Metodo: dispara el formulario
function guardarDatos(event){

    //1.no recargar página
    event.preventDefault(); 

    //2.Captura el elemento formulario
    const form = event.target

    //3.captura del elemento formulario
    const formData = new FormData(form)

    //4.Crear el objeto del libro usando el form data (imputs del formulario)
    let empresaAGuardar = {}
    formData.forEach((value, key) => empresaAGuardar[key] = value )
    // Necesito un identificador unico por cada empresa para poder modificar o borrar
    empresaAGuardar.id = generadorUnicoId()
    // Comienzo el estado completado como "no", para poder mostrarlo en el dom
    empresaAGuardar.completado = "No";

    //5.Almacenar la información
    const empresasDesdeMemoria = traerDatosDesdeMemoria()
    const empresasActualizada = [...empresasDesdeMemoria, empresaAGuardar]
    guardarEmpresasEnMemoria(empresasActualizada)

    //6. Limpiar formulario
    form.reset()

    //7. Listar la información previamente almacenados
    mostrarEmpresasEnDOM(empresasActualizada)

}

//Segundo Metodo: Función para mostrar los datos

function mostrarEmpresasEnDOM(ajustes){
    const listaDeElementos = document.querySelector("#lista-empresas")

    // Si pasa este error es que me olvide de poner un elemento html con este id
    if (!listaDeElementos) { 
        console.error("No se encontro el elemento `#lista-empresas`")
        return 
    }

    // Me creo internamente un html por cada una de las empresas
    const listaEmpresasHtml = ajustes.map(elemento => {
        return `
        <div class="datos-ajustes">
        <ul class="datos">
        <li>Nombre: ${elemento.nombre}</li>
        <li>Grupo: ${elemento.grupo}</li>
        <li>Fecha: ${elemento.fecha}</li>
        <li>Ajuste: ${elemento.porcentaje}%</li>
        <li>Observaciones: ${elemento.obs}</li>
        <li>Completado: ${elemento.completado}</li>
        </ul>
        <div class="botones-completar-enviar">
        <button id="boton-completar" onclick="completar('${elemento.id}')">Completar</button>
        <button id="boton-eliminar"
            onclick="borrarEmpresa('${elemento.id}')">ELIMINAR &times;</button>
        </div>
        </div>
        `
  })

  // Envio al dom los htmls que cree internamente, juntandolos por ""
  listaDeElementos.innerHTML = listaEmpresasHtml.join("")
}


// Metodo 3: función para obtener desde localStorage los datos almacenados
function traerDatosDesdeMemoria() {
    const datosFromMemory = localStorage.getItem("datos")

    // Si no encuentro nada, tengo que iniciar la memoria con una lista vacia.
    if(!datosFromMemory) {
        
        guardarEmpresasEnMemoria([])
        return []
    } else {
        // Si encuentro me traigo esa informacion y la parse para poder presentarlo como una lista de objetos.
        const datosEnMem = JSON.parse(datosFromMemory)
        return datosEnMem;
    }
}


//Guardar en localStorage los datos que le indiquemos pero solo nos acepta string asi que convertimos con el stringify
function guardarEmpresasEnMemoria(datos) {
    localStorage.setItem("datos", JSON.stringify(datos))
}

//Borrar datos
function borrarEmpresa(idEmpresaABorrar) {
    //consultar los datos en memoria
    const datos = traerDatosDesdeMemoria()

    // con !== evito traerme en la lista la empresa a borrar y entonces queda fuera de lo que guardare
    const empresasFiltrados = datos.filter((dato) => dato.id !== idEmpresaABorrar)
        
    //Actualizar en memoria
    guardarEmpresasEnMemoria(empresasFiltrados)

    //Mostrar sin la empresa eliminada
    mostrarEmpresasEnDOM(empresasFiltrados)
}

// Actualizo datos cuando quiero completar un proceso.
function completar(idEmpresa) {
    //consultar los datos en memoria
    const datos = traerDatosDesdeMemoria()

    // con === me traigo la empresa que quiero cambiarle el completado.
    const empresaObjeto = datos.filter((dato) => dato.id === idEmpresa)

    // como filter solo trae listas necesito seleccionar el 1er elemento de esa lista y hacerle el cambio
    empresaObjeto[0].completado = "Si";
     // con !== evito traerme en la lista la empresa modificada
    const listaEmpresasSinModificado = datos.filter((dato) => dato.id !== idEmpresa)
     // junto las empresas no modificadas con la modificada y lo guardo en una lista para luego mandar a memoria
    const empresasModificadas = [...listaEmpresasSinModificado, empresaObjeto[0]]
        
    //Actualizar en memoria
    guardarEmpresasEnMemoria(empresasModificadas)

    //Mostrar de nuevo
    mostrarEmpresasEnDOM(empresasModificadas)
}

//Generar un unico ID para cada libro
//Date.now: genera el id con la fecha y hora(con milesima de segundo) del dia
function generadorUnicoId(){
    return "empresa - " + Date.now()
}

// Espero a que la pagina cargue para traerme los datos desde la memoria.
document.addEventListener("DOMContentLoaded", () => {
    const empresas = traerDatosDesdeMemoria()
    mostrarEmpresasEnDOM(empresas)

})