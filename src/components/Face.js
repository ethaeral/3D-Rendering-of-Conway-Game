import React, { useEffect } from "react";
import { FaceContainer } from "../styles";

function Face({ info, animation, matrix, counter, onGoing, n }) {
	const { color, isAlive } = info;
	useEffect(() => {}, [counter, matrix, onGoing, animation, n, isAlive]);
	return (
		<FaceContainer
			isAlive={isAlive}
			color={color}
			fifthCalc={Math.pow(-1, 4) * 90}
			sixthCalc={Math.pow(-1, 5) * 90}
		/>
	);
}
export default React.memo(Face);
