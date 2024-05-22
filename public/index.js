document.addEventListener('DOMContentLoaded', function () {
    // Obtener el elemento del input de fecha
    var fechaInput = document.getElementById('fecha');
    
    // Obtener la fecha y hora actual en la zona horaria de Chile
    var fechaHoraChile = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
    
    // Establecer el valor del input con la fecha y hora de Chile
    fechaInput.value = fechaHoraChile;
    
    // Función para calcular la diferencia de horas
    function calcularTotalHoras() {
        // Obtener las horas de inicio y término de la faena
        var horaInicio = document.getElementById('hora_inicio').value;
        var horaTermino = document.getElementById('hora_termino').value;
    
        // Convertir las horas de texto a objetos Date
        var inicio = new Date('2024-05-21T' + horaInicio);
        var termino = new Date('2024-05-21T' + horaTermino);
    
        // Calcular la diferencia en milisegundos
        var diferencia = termino - inicio;
    
        // Convertir la diferencia de milisegundos a horas
        var totalHoras = diferencia / (1000 * 60 * 60);
    
        // Mostrar el total de horas en el campo correspondiente
        document.getElementById('total_horas_faena').value = totalHoras.toFixed(2);
    }
    
    // Llamar a la función para calcular el total de horas cuando cambie el valor de las horas de inicio o término
    document.getElementById('hora_inicio').addEventListener('change', calcularTotalHoras);
    document.getElementById('hora_termino').addEventListener('change', calcularTotalHoras);
    
    // Función para mostrar u ocultar el campo de observación según la selección del usuario
    function mostrarObservacion() {
        var tipoTrabajo = document.getElementById('tipo_trabajo').value;
        var campoObservacion = document.getElementById('campo_observacion');
    
        if (tipoTrabajo === 'otros') {
            campoObservacion.style.display = 'block';
        } else {
            campoObservacion.style.display = 'none';
        }
    }
    
    // Llamar a la función para mostrar u ocultar el campo de observación cuando cambie la selección del usuario
    document.getElementById('tipo_trabajo').addEventListener('change', mostrarObservacion);
    
    // Llamar a la función al cargar la página para asegurarse de que el campo de observación se muestre correctamente
    mostrarObservacion();
    
 // Inicializar Signature Pad en el canvas del Supervisor
var canvas_supervisor = document.getElementById('canvas_supervisor');
var signaturePad_supervisor = new SignaturePad(canvas_supervisor);
    
 // Inicializar Signature Pad en el canvas del Jefe de Centro
var canvas_jefe_centro = document.getElementById('canvas_jefe_centro');
var signaturePad_jefe_centro = new SignaturePad(canvas_jefe_centro);
    
    // Función para borrar la firma en un canvas específico
    function borrarFirma(signaturePad) {
        signaturePad.clear();
    }
    
    // Asignar event listeners a los botones de borrar firma
    document.getElementById('borrar_supervisor').addEventListener('click', function(event) {
        event.preventDefault();
        borrarFirma(signaturePad_supervisor);
    });
    
    document.getElementById('borrar_jefe_centro').addEventListener('click', function(event) {
        event.preventDefault();
        borrarFirma(signaturePad_jefe_centro);
    });
    
    // Manejar el envío del formulario
  document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente

    // Capturar los datos del formulario
    const formData = new FormData(this);

    // Añadir las firmas al formulario como imágenes base64
    formData.append('firma_supervisor', signaturePad_supervisor.toDataURL());
    formData.append('firma_jefe_centro', signaturePad_jefe_centro.toDataURL());

    // Hacer una solicitud al servidor para generar el PDF
    fetch('/generar-pdf', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al generar el PDF');
        }
        return response.blob();
    })
    .then(blob => {
        // Crear un enlace para descargar el PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formulario.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        // Manejar errores
    });
});
});