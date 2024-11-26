import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

async function generatePDFWithImage() {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("output.pdf")); 

  try {
    const imageUrl = "https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626";
    
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imgBuffer = Buffer.from(response.data, "binary");

    doc.image(imgBuffer, 0, 15, { width: 300 }).text("Proportional to width", 0, 0);
  } catch (error) {
    console.error(error);
  } finally {
    doc.end(); 
  }
}

generatePDFWithImage();
