import React, { useEffect } from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Main({ animation, matrix, counter }) {
	useEffect(() => {}, [counter, matrix, animation]);
	return (
		<MainContainer animation={animation}>
			{matrix.map((MDMatrix) => {
				return (
					<Matrix
						key={`${customUUID()}`}
						MDMatrix={MDMatrix}
						animation={animation}
						matrix={matrix}
						counter={counter}

					/>
				);
			})}
		</MainContainer>
	);
}
export default React.memo(Main);
