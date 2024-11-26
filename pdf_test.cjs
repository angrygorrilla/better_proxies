//import PDFDocument from "pdfkit";
//import blobStream from "pdfkit";


const PDFDocument = require('pdfkit');
const blobStream = require('pdfkit');

// create a document and pipe to a blob
var doc = new PDFDocument();
var stream = doc.pipe(blobStream());

// draw some text
doc.fontSize(25).text('Here is some vector graphics...', 100, 80);

// some vector graphics
doc
  .save()
  .moveTo(100, 150)
  .lineTo(100, 250)
  .lineTo(200, 250)
  .fill('#FF3300');

doc.circle(280, 200, 50).fill('#6600FF');

// an SVG path
doc
  .scale(0.6)
  .translate(470, 130)
  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  .fill('red', 'even-odd')
  .restore();

doc.image('https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626', 320, 15, {fit: [100, 100]})
   .rect(320, 15, 100, 100)
   .stroke()
   .text('Fit', 320, 0);
   
// end and display the document in the iframe to the right
doc.end();
stream.on('finish', function() {
  iframe.src = stream.toBlobURL('application/pdf');
});