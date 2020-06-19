import React, { useEffect, useState } from "react";
import Unit from "./Unit";
import { RowContainer } from "../styles";

export default function Row({ array }) {
	const [elements, setElements] = useState([]);
	useEffect(() => {
		setElements(array);
	}, [array]);
	return (
		<RowContainer>
			{elements.map((unit, idx) => (
				<Unit key={`${idx << 4}`} info={unit} />
			))}
		</RowContainer>
	);
}
