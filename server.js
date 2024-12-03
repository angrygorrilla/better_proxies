import express from "express";
import cors from "cors";
import fs from "fs";
import * as pdf_write from "./pdf_write.js";
import * as card_sort from "./card_sort.js";
import path from "path";

const app = express();
const outputFilePath = path.resolve("output_cards.pdf");

app.use(express.json());
app.use(express.static("public"));
app.use(cors({ origin: "*" }));

app.post("/cards", async (req, res) => {
	console.log(req.body.cards);
	try {
		const card_name_list = req.body.cards;

		if (!card_name_list || !Array.isArray(card_name_list)) {
			return res.status(400).send("Invalid or missing card names.");
		}

		console.log("Received card names:", card_name_list);

		// Fetch card details
		let cards = await card_sort.construct_card_list(card_name_list);
		console.log("Fetched cards:", cards);

		// Generate a generator for card faces
		let generator = card_sort.card_face_generator(cards);

		// Generate the PDF
		const outputFilePath = "output_cards.pdf"; // Specify the file path
		await pdf_write.generate_pdf(generator, outputFilePath);

		console.log("PDF generation complete!");

		// Respond with a success message and file download link
		res.status(200).send({
			message: "PDF generated successfully!",
			downloadLink: `http://localhost:3000/${outputFilePath}`,
		});
	} catch (error) {
		console.error("Error processing /cards request:", error.message);
		res.status(500).send("Server error while processing cards.");
	}
});

const parseCards = (input) => {
	const lines = input.trim().split("\n");
	const cardRegex =
		/^(\d+)\s+([A-Za-z0-9\s,.'\-]+)(?:\s*(<[^>]+>|(?:\[[^\]]*\])))?\s*(?:\[[^\]]*\])?/;

	return lines
		.map((line) => {
			const match = line.match(cardRegex);
			if (match) {
				const quantity = match[1];
				const cardName = match[2].trim();
				const setName = match[3] ? match[3].replace(/[^\w\s]/g, "") : "";
				return {
					card_name: cardName,
					quantity: parseInt(quantity),
					setName: setName || "",
				};
			}
			return null;
		})
		.filter(Boolean);
};

app.put("/", (req, res) => {
	const cardData = req.body.cards;

	if (!cardData) {
		return res.status(400).send("No card data provided.");
	}

	try {
		const decksFilePath = "decks.json";

		fs.readFile(decksFilePath, "utf-8", (err, data) => {
			if (err) {
				return res.status(500).send("Error reading the file.");
			}

			let decks = [];
			try {
				decks = JSON.parse(data);
			} catch (jsonError) {
				return res.status(500).send("Error parsing the JSON file.");
			}

			decks = parseCards(cardData);

			fs.writeFile(
				decksFilePath,
				JSON.stringify(decks, null, 2),
				(writeErr) => {
					if (writeErr) {
						return res.status(500).send("Error writing to the file.");
					}

					res.status(200).send("Deck updated successfully.");
				}
			);
		});
	} catch (error) {
		res.status(500).send("Unexpected server error.");
	}
});

app.get("/download/:filename", (req, res) => {
	const { filename } = req.params;

	// Make sure the filename matches the expected file
	if (filename === "output_cards.pdf") {
		// Check if the file exists
		if (!fs.existsSync(outputFilePath)) {
			return res.status(404).send("File not found.");
		}

		// Send the file for download
		res.download(outputFilePath, filename, (err) => {
			if (err) {
				console.error("Error sending file:", err.message);
				res.status(500).send("Error sending the file.");
			}
		});
	} else {
		res.status(404).send("File not found.");
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});


