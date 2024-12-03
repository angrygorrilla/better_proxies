import React, { useState } from "react";
import axios from "axios";
import deck from "../../decks.json";

const Button = () => {
	const [cardNames, setCardNames] = useState([]);
	const [deckLength, setDeckLength] = useState(0);
	const [downloadLink, setDownloadLink] = useState("");

	const handleSubmit = async () => {
		const cardNames = deck.map((card) => card.card_name);

		setCardNames(cardNames);
		setDeckLength(cardNames.length);

		try {
			console.log(cardNames);
			const response = await axios.post("http://localhost:3000/cards", {
				cards: cardNames,
			});

			// Update the download link with the response data
			if (response.data && response.data.downloadLink) {
				setDownloadLink(response.data.downloadLink);
			}
		} catch (error) {
			console.error("Error fetching cards:", error.message);
		}
	};

	const handleDownloadPDF = async () => {
		try {
			const filename = "output_cards.pdf"; // Match this to your server file name
			const response = await axios.get(
				`http://localhost:3000/download/${filename}`,
				{ responseType: "blob" } // To handle binary data
			);

			// Create a blob and trigger download
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
		} catch (error) {
			console.error("Error downloading PDF:", error.message);
		}
	};

	return (
		<div>
			<button onClick={handleSubmit}>Generate PDF</button>
			{downloadLink && (
				<button onClick={handleDownloadPDF}>Download PDF</button>
			)}
		</div>
	);
};

export default Button;
