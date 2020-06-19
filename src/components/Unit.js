import React, { useEffect } from "react";

import { UnitContainer } from "../styles";
import Face from "./Face";
import { customUUID } from "../utils/Helpers";

function Unit({ info, animation, matrix, counter, onGoing, n }) {
	useEffect(() => {}, [counter, matrix, onGoing, animation, n]);
	const faceNum = [0, 0, 0, 0, 0, 0];
	return (
		<UnitContainer>
			{faceNum.map((face) => (
				<Face
					key={`${customUUID()}`}
					info={info}
					animation={animation}
					matrix={matrix}
					counter={counter}
		
				/>
			))}
		</UnitContainer>
	);
}
export default React.memo(Unit);
