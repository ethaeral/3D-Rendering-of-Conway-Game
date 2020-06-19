import React, { useEffect } from "react";
import Unit from "./Unit";
import { RowContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Row({ array, animation, matrix, counter, onGoing, n }) {
	useEffect(() => {}, [counter, matrix, onGoing, animation, n]);
	return (
		<RowContainer>
			{array.map((unit) => (
				<Unit
					key={`${customUUID()}`}
					info={unit}
					animation={animation}
					matrix={matrix}
					counter={counter}
				
				/>
			))}
		</RowContainer>
	);
}
export default React.memo(Row);
