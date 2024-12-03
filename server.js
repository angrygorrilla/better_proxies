import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors({ origin: "http://localhost:5173" }));

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

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
