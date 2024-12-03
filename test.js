import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

import * as pdf_write from "./pdf_write.js";
import * as card_sort from "./card_sort.js";

// console.log('hello world')

function alter_array(object) {
	object.list.push("hello");
}

function test_array() {
	let object = { list: ["hi"] };
	alter_array(object);
	console.log(object);
}

// let card_name_list = ["ajani's Pridemate", "Huntmaster of the Fells"];
// let cards = card_sort.construct_card_list(card_name_list);
// let generator = card_sort.card_face_generator(cards);
// console.log(generator);
// pdf_write.generate_pdf(generator);
(async () => {
	try {
		// List of card names to fetch
		let card_name_list = ["ajani's Pridemate", "Huntmaster of the Fells"];

		// Construct card list (wait for the promise to resolve)
		let cards = await card_sort.construct_card_list(card_name_list);
		console.log("Fetched cards:", cards);

		// Generate a generator for card faces
		let generator = card_sort.card_face_generator(cards);

		// Pass the generator to the PDF generation function
		await pdf_write.generate_pdf(generator);

		console.log("PDF generation complete!");
	} catch (error) {
		console.error("Error in test.js:", error.message);
	}
})();
