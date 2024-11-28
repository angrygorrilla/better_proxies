import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";



//Complete a search on each card in a list of names
export function construct_card_list(name_list){
  let card_list=[];
  for (const card_name in name_list){
    //card list here needs to be a pass by reference
    card_fectch(card_name,card_list);
  }
  return card_list;

}

//do an axios request for an image from a URI
export async function get_art_api(uri){
  console.log('getting art')
  console.log(uri)
  const response = await axios.get(uri, { responseType: "arraybuffer" });
  const imgBuffer = Buffer.from(response.data, "binary");
 // console.log(imgBuffer)
}

//Generator for all card arts to fill a pdf from. needs to deal with duel-faced cards
export async function* card_face_generator(card_list){

  for (let i=0;i<card_list.length;i++){
    try {

      if (card_faces.length==1){
        try{
          const imageUrl = card_list[i].image_uris.large;
          imagebuffer=get_art_api(imageUrl);
          yield imgBuffer;
        }
        catch {
          const imageUrl = card_list[i].image_uris.normal
          imagebuffer=get_art_api(imageUrl)
          yield imgBuffer;

        }
        //console.log(response);
      
      }
      else{
        for (let j=0;j<2;j++){
          try{
            const imageUrl = card_list[i].card_faces[j].image_uris.large
            imagebuffer=get_art_api(imageUrl)
        yield imgBuffer;
          }
          catch {
            const imageUrl = card_list[i].card_faces[j].image_uris.normal
            imagebuffer=get_art_api(imageUrl)
            yield imgBuffer;
          }
        }
        
          //console.log(response);
        
      }

    } catch (error) {
      console.error(error);
    }finally {
   
    }
  }
}


// creats a list of cards in a cardlist
//card list should start as an empty list, then is filled up with card json data from the search function
export async function card_fectch(name,cardlist) {
//collector's number is within a set, so we need the set and the collector's number to get an exact card

//search terms for getting the most expensive:
//ajani's pridemate unique:cards prefer:usd-high

//for card selection, we likely want to do a search for unique:art
//need to deal with multi-face, useing is:flip is:dfc and is:mdfc
console.log('>name<') 

//name is 0 or 1 - something to do with lists?
console.log('>'+name+'<')
  try {
    //old search query: "https://api.scryfall.com/cards/search?order=cmc&q=!\""+name+"\" unique:prints";
    const card_search_results = "https://api.scryfall.com/cards/search?order=cmc&q="+name+" unique:prints";
    
    axios.get(card_search_results, { responseType: "json" }).then(function(response){cardlist.push(pick_card(response))});
    //const imgBuffer = Buffer.from(response.data, "json");

    //doc.image(imgBuffer, 0, 15, { width: 300 }).text("Proportional to width", 0, 0);
  } catch (error) {
    //do a less specific search
    const less_specific_card_search_results = "https://api.scryfall.com/cards/search?order=cmc&q="+name+" unique:prints";
    axios.get(card_search_results, { responseType: "json" }).then(function(response){cardlist.push(pick_card(response))});
    //console.error(error);
  } finally {
    console.log('>done<')
  }

}

//pick card from a list of json cards, using the comparison function given
function pick_card(data){
    //console.log(data)
    let list=data.data.data
    let len=data.data.total_cards
    let picked = list.sort(expensive_full_art)

    for (let i=0;i<len;i++){
        //console.log(picked[i].border_color)
    }
    return picked
}

//comparison function for json card objects
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

