import React, { useEffect } from "react";
import { FaceContainer } from "../styles";

function Face({ info }) {
	const { color, isAlive } = info;
	useEffect(() => {}, [isAlive]);
	return (
		<FaceContainer
			isAlive={isAlive}
			color={color}
			fifthCalc={Math.pow(-1, 4) * 90}
			sixthCalc={Math.pow(-1, 5) * 90}></FaceContainer>
	);
}
export default React.memo(Face);
