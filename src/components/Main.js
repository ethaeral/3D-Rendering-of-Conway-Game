import React from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Main({ animation, matrix, outline, xTrans, yTrans }) {
	return (
		<MainContainer animation={animation} xTrans={xTrans} yTrans={yTrans}>
			{matrix.map((MDMatrix) => {
				return (
					<Matrix
						key={`${customUUID()}`}
						MDMatrix={MDMatrix}
						outline={outline}
					/>
				);
			})}
		</MainContainer>
	);
}
export default React.memo(Main);
