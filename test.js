import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";


import * as pdf_write from "./pdf_write.js"
import * as card_sort from "./card_sort.js"

console.log('hello world')


let card_name_list = ["ajani's Pridemate","Hunter of the Fells"]
let cards=card_sort.construct_card_list(card_name_list)
let generator=card_sort.card_face_generator(cards)
pdf_write.generate_pdf(generator);
