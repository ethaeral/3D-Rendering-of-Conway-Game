import React from "react";
import { matrix } from "./matrixGen";
import Matrix from "./Matrix";
import { MainContainer } from "./styles";
export default function Main() {
	return (
		<MainContainer	>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${idx << 3}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
