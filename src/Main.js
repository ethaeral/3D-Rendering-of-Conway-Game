import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "./styles";
export default function Main({ animation, matrix, counter, n}) {
	useEffect(() => {}, [matrix, counter, n]);
	return (
		<MainContainer animation={animation}>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${idx << 3}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
