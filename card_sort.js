import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

// Complete a search on each card in a list of names
export async function construct_card_list(name_list) {
  let card_list_object = { list: [] }; // Initialize empty list
  console.log("Input names:", name_list);

  // Await all card fetch promises
  await Promise.all(
    name_list.map((name) => card_fectch(name, card_list_object))
  );

  console.log("Constructed card list:", card_list_object);
  return card_list_object.list; // Return the list of cards
}

// Fetch an image buffer from a URI
export async function get_art_api(uri) {
  try {
    console.log("Fetching art from:", uri);
    const response = await axios.get(uri, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error fetching art:", error.message);
    throw error;
  }
}

// Generator to yield card face images for a PDF
export async function* card_face_generator(card_list,card_number) {
  console.log(card_number)
  if (card_list.length!==card_number.length){
    console.log('different lengths!')
    throw error
  }
  for (const [i, card] of card_list.entries()) {
    for (let j=0;j<card_number[i];j++){
      try {
        const faces = card.card_faces || [{ image_uris: card.image_uris }];

        for (let face of faces) {
          const imageUrl = face.image_uris?.large || face.image_uris?.normal;
          if (imageUrl) {
            const imgBuffer = await get_art_api(imageUrl);
            yield imgBuffer;
          }
        }
      } catch (error) {
        console.error("Error in card_face_generator:", error.message);
      }
    }
  }
}

// Helper to push a card to the card list object
function card_pusher(card, list_obj) {
  console.log("Pushing card:", card.name);
  list_obj.list.push(card);
}

// Fetch card details by name and update the card list
export async function card_fectch(name, card_list_obj) {
  const cardlist = card_list_obj.list;
  console.log("Fetching card for:", name);

  try {
    const card_search_results = `https://api.scryfall.com/cards/search?order=cmc&q=!"${name}" unique:prints`;

    const response = await axios.get(card_search_results, {
      responseType: "json",
    });
    card_pusher(pick_card(response), card_list_obj);
  } catch (error) {
    console.log("First search failed, attempting less specific search...");
    try {
      const less_specific_card_search_results = `https://api.scryfall.com/cards/search?order=cmc&q=${name} unique:prints`;

      const response = await axios.get(less_specific_card_search_results, {
        responseType: "json",
      });
      card_pusher(pick_card(response), card_list_obj);
    } catch (secondError) {
      console.error(
        "Second search failed:",
        secondError.response?.data?.details || secondError.message
      );
    }
  } finally {
    console.log("> Fetch complete for:", name);
  }
}

// Pick the best card from search results
function pick_card(data) {
  const list = data.data.data;
  const picked = list.sort(expensive_full_art)[0];
  console.log("Picked card:", picked.name);
  return picked;
}

// Compare two card objects by price and attributes
function expensive_full_art(a, b) {
  const getPrice = (card) =>
    parseInt(card.prices.usd || "0") +
    (card.border_color === "borderless" ? 10000 : 0) +
    (card.full_art ? 1000000 : 0);

  return getPrice(b) - getPrice(a); // Descending order
}
