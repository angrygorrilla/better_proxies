import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

//Uses a generator that returns the card images to populate a pdf 
async function generate_pdf(generator){
  const doc = new PDFDocument({size: 'LEGAL'});
  doc.pipe(fs.createWriteStream("output_2.pdf"));

  console.log('in pdf function')

  const card_width=180
  const card_height=252


  let position=0

  for await (let result of generator) {
    console.log(1)
    if (position>8){
      position=0
      doc.addPage()
    }
    let x_pos=(position%3)
    let y_pos=(Math.floor(position/3))

    let cur_x=32+(x_pos*card_width)
    let cur_y=32+(y_pos*card_height)

    doc.image(result, cur_x, cur_y, {fit: [card_width,card_height]})
    position=position+1
  }
  doc.end();
}

//test function to yeild n burgeoning cards from the scryfall art api
//Use this to test the pdf formatter
async function* yield_burgeoning(num) {

  for (let i=0;i<num;i++){
      try {
        const imageUrl = "https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626";
        
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imgBuffer = Buffer.from(response.data, "binary");
        console.log(imgBuffer)
        yield imgBuffer;
        //console.log(response);
      } catch (error) {
        console.error(error);
        yield {error: error.message};
      } finally {
        
      }
    }
  }


function test_generator(){
  const gen=yield_burgeoning(15);
//generatePDFWithImage(gen);
  generate_pdf(gen);
}

