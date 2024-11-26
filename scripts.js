import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";


async function generate_pdf(generator){
  const doc = new PDFDocument({size: 'LEGAL'});
  doc.pipe(fs.createWriteStream("output_2.pdf"));

  const card_width=180
  const card_height=252

  result=generator.next();
  while (result.done===true){
    const cur_x=32;
    const cur_y=32;
    for (const i=0;i<3;i++){
      for (const j=0;j<3;j++){
        if (result.done===false){
          doc.image(result.value, cur_x, cur_y, {fit: [180,252]})
          result=generator.next()
          cur_x+=card_width
        }
        
      }
      if (result.done===false){
        doc.image(result.value, cur_x, cur_y, {fit: [180,252]})
        result=generator.next()
        cur_y+=card_height
      }
    }
    if (result.done===false){
      doc.addPage()
    }
  }
  doc.end(); 
}


async function generatePDFWithImage() {
  const doc = new PDFDocument({size: 'LEGAL'});
  doc.pipe(fs.createWriteStream("output_2.pdf")); 

  try {
    const imageUrl = "https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626";
    
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imgBuffer = Buffer.from(response.data, "binary");



    //card size is 2.5 x 3.5 inches - at 300 dpi, we expect 750 X 1050
    // 1/2 inch borders should mean we start at 50 pixels
    //We'll need corner marks between cards look at the rectangle


    // pdf uses points as it's measurement, 1 inch is 72 points


   //50,50
   //800,50

   doc.image(imgBuffer, 36, 36, {fit: [180,252]})
   //.rect(320, 15, 100, 100)
   //.stroke()

   doc.image(imgBuffer, 180+36, 36, {fit: [180, 252]})
   //.rect(320, 15, 100, 100)
   //.stroke()
    //.text('Fit', 320, 0);
  } catch (error) {
    console.error(error);
  } finally {
    doc.end(); 
  }
}


//async and yield don't play nice - need to await/ promise.resolve
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator
async function* yield_burgeoning(num) {

  for (const i=0;i<num;i++){
      try {
        const imageUrl = "https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626";
        
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imgBuffer = Buffer.from(response.data, "binary");
  
      } catch (error) {
        console.error(error);
      } finally {
        //yield 100
        yield imgBuffer;
      }
    }
  }

function* yield_1(num) {
    yield 1;
    yield 2;
}


//generatePDFWithImage();

const gen=yield_1();
console.log(await gen.next())
console.log(await gen.next())
console.log(await gen.next())
//generate_pdf(gen);


