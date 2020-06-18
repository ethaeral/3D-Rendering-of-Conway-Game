import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";

export default function Main({ animation, matrix, counter, visible }) {
	useEffect(() => {}, [counter, visible]);
	console.log(matrix);
	return (
		<MainContainer animation={animation} visible={visible}>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${idx << 3}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
