import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Main({ animation, matrix, counter, onGoing }) {
	useEffect(() => {}, [counter, matrix, onGoing, animation]);
	return (
		<MainContainer animation={animation}>
			{matrix.map((MDMatrix, idx) => {
				return <Matrix key={`${customUUID()}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
export default React.memo(Main);
