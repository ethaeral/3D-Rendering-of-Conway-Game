import React, { useEffect } from "react";
import { FaceContainer } from "../styles";

export default function Face({ info, first }) {
	const { color, isAlive } = info;
	useEffect(() => {}, [isAlive]);
	return (
		<FaceContainer
			first={first}
			isAlive={isAlive}
			color={color}
			fifthCalc={Math.pow(-1, 4) * 90}
			sixthCalc={Math.pow(-1, 5) * 90}></FaceContainer>
	);
}
