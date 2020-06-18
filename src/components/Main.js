import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";

export default function Main({ animation, matrix, counter, n }) {
	useEffect(() => {}, [counter, n]);
	console.log(matrix);
	return (
		<MainContainer animation={animation}>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${idx << 3}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
