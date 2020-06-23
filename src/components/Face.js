import React from "react";
import { FaceContainer } from "../styles";

function Face({ info, outline}) {
	const { color, isAlive } = info;
	return (
		<FaceContainer
		outline={outline}
			isAlive={isAlive}
			color={color}
			// calculate transformation for 5th and 6th face of cube
			fifthCalc={Math.pow(-1, 4) * 90}
			sixthCalc={Math.pow(-1, 5) * 90}
		/>
	);
}
export default React.memo(Face);
