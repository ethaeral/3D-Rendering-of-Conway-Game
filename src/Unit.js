import React, { useEffect, useState } from "react";

import { UnitContainer } from "./styles";
import Face from "./Face";

export default function Unit({ info }) {
	const { isAlive } = info;
	const [invert, setInvert] = useState(false);
	const faceNum = [0, 0, 0, 0];
	useEffect(() => {}, [isAlive, invert]);
	return (
		<UnitContainer
			isAlive={isAlive}
			onClick={() => {
				info.isAlive = !info.isAlive;
				setInvert(!invert);
			}}>
			{faceNum.map(() => (
				<Face />
			))}
		</UnitContainer>
	);
}
