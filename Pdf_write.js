import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

//Uses a generator that returns the card images to populate a pdf 
export async function generate_pdf(generator){
  const doc = new PDFDocument({size: 'LEGAL'});
  doc.pipe(fs.createWriteStream("output_3.pdf"));

  console.log('in pdf function')

  //in pdf sizing, 72 points=1 inch
  let x_margin=32 // 0.5 inches
  let y_margin=104 //1.5 inches
  const card_width=180  //2.5 inches
  const card_height=252  //3.5 inches


  let position=0
  for await (let result of generator) {
    console.log('adding card to position:'+position)
    if (position>8){
      console.log('adding page')
      position=0
      doc.addPage()
    }
    let x_pos=(position%3)
    let y_pos=(Math.floor(position/3))

    let cur_x=x_margin+(x_pos*card_width)
    let cur_y=y_margin+(y_pos*card_height)

    doc.image(result, cur_x, cur_y, {fit: [card_width,card_height]})
    position=position+1
  }
  doc.end();
}

//
async function* image_generator(name_list, count_list){

}

//test function to yeild n burgeoning cards from the scryfall art api
//Use this to test the pdf formatter
export async function* yield_burgeoning(num) {

  for (let i=0;i<num;i++){
      try {
        const imageUrl = "https://cards.scryfall.io/png/front/6/d/6da045f8-6278-4c84-9d39-025adf0789c1.png?1562404626";
        
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imgBuffer = Buffer.from(response.data, "binary");
        //console.log(imgBuffer)
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
  const gen=yield_burgeoning(8);
//generatePDFWithImage(gen);
  generate_pdf(gen);
}
//test_generator()

