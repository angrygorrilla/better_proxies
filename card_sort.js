import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

async function generatePDFWithImage() {
    console.log(1>2)
  const doc = new PDFDocument();
  //doc.pipe(fs.createWriteStream("output.pdf")); 



//collector's number is within a set, so we need the set and the collector's number to get the card

//search terms for getting the most expensive:

//ajani's pridemate unique:cards prefer:usd-high

//for card selection, we likely want to do a search for unique:art

//need to deal with multi-face, useing is:flip is:dfc and is:mdfc
  try {
    const card_search_results = "https://api.scryfall.com/cards/search?order=cmc&q=!\"Ajani's Pridemate\" unique:prints";
    
    axios.get(card_search_results, { responseType: "json" }).then(function(response){pick_card(response)});
    //const imgBuffer = Buffer.from(response.data, "json");

    //doc.image(imgBuffer, 0, 15, { width: 300 }).text("Proportional to width", 0, 0);
  } catch (error) {
    //do a less specific search
    
    console.error(error);
  } finally {
    doc.end(); 
  }
}

function pick_card(data){
    console.log(data)
    let list=data.data.data
    let len=data.data.total_cards
    let picked = list.sort(expensive_full_art)

    for (let i=0;i<len;i++){
        console.log(picked[i].border_color)
    }
    return picked
}


function expensive_full_art(a,b){
    a.prices.usd=parseInt(a.prices.usd)
    b.prices.usd=parseInt(b.prices.usd)
    if (a.border_color=='borderless'){
        a.prices.usd+=10000
    }
    if (a.full_art===true){
        a.prices.usd+=1000000
    }
    if (b.border_color=='borderless'){
        b.prices.usd+=10000
    }
    if (b.full_art===true){
        b.prices.usd+=1000000
    }

    return (b.prices.usd-a.prices.usd)


}


generatePDFWithImage();
