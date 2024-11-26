console.log("hello world")

import PDFDocument from "pdfkit";
import blobStream from "pdfkit";
import fs from "fs";

var doc = new PDFDocument();

console.log("hello world")


doc.pipe(fs.createWriteStream('test_pdf.pdf'));
doc.pipe(res);  

// add stuff to PDF here using methods described below...
doc.text('Hello world!')
// finalize the PDF and end the stream
doc.end();