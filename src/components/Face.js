import React from "react";
import { FaceContainer } from "../styles";

function Face({ info}) {
	const { color, isAlive } = info;
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
