import React, { useState } from "react";
import axios from "axios";

const Form = () => {
	const [cardName, setCardName] = useState(""); 

	const handleChange = (e) => {
		setCardName(e.target.value); 
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); 

		try {
			const response = await axios.put("http://localhost:3000", {
				cards: cardName, 
			});
			console.log("Deck updated successfully:", response.data);
		} catch (error) {
			console.error("There was an error updating the deck:", error);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<textarea
					rows="5"
					name="text"
					value={cardName}
					onChange={handleChange} 
				/>
				<button type="submit">Submit List</button>
			</form>
		</>
	);
};

export default Form;
