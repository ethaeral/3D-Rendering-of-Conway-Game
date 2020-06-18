import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";

export default function Main({ animation, matrix, counter, visible, first }) {
	useEffect(() => {}, [counter, visible]);
	return (
		<MainContainer animation={animation} visible={visible} first={first}>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${idx << 3}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
