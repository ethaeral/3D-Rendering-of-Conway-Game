import React, { useEffect } from "react";
import { customUUID } from "../utils/Helpers";
import Row from "./Row";
import { WindowContainer } from "../styles";

function Matrix({ MDMatrix, animation, matrix, counter, onGoing, n }) {
	useEffect(() => {}, [counter, matrix, onGoing, animation, n]);
	return (
		<WindowContainer>
			{MDMatrix.map((array) => {
				return (
					<Row
						key={`${customUUID()}`}
						array={array}
						animation={animation}
						matrix={matrix}
						counter={counter}
				
					/>
				);
			})}
		</WindowContainer>
	);
}
export default React.memo(Matrix);
