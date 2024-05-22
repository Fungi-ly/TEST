const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const PDFDocument = require('pdfkit');
const multer = require('multer');
const upload = multer();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generar-pdf', (req, res) => {
    const datosFormulario = req.body;

    console.log('Datos recibidos en el servidor:', datosFormulario); // Verificar datos recibidos

    const doc = new PDFDocument();
    const nombreArchivo = 'formulario.pdf';
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    doc.pipe(res);

    doc.fontSize(12).text('Datos del formulario:', { underline: true });
    doc.fontSize(10);
    for (const key in datosFormulario) {
        if (datosFormulario.hasOwnProperty(key) && !key.startsWith('firma')) {
            doc.text(`${key}: ${datosFormulario[key]}`);
        }
    }

    // Agregar las firmas al PDF si están disponibles
    const firmaSupervisor = req.body['firma_supervisor'];
    const firmaJefeCentro = req.body['firma_jefe_centro'];

    if (firmaSupervisor) {
        const firmaSupervisorBuffer = Buffer.from(firmaSupervisor.split(';base64,').pop(), 'base64');
        doc.image(firmaSupervisorBuffer, { width: 150 });
    }

if (firmaJefeCentro) {
    const firmaJefeCentroBuffer = Buffer.from(firmaJefeCentro.split(';base64,').pop(), 'base64');
    doc.image(firmaJefeCentroBuffer, { width: 150 });
}

    doc.end();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});