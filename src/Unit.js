import React from "react";

import { UnitContainer } from "./styles";
import Face from "./Face";

export default function Unit({ info }) {
	const faceNum = [0, 0, 0, 0, 0, 0];
	return (
		<UnitContainer>
			{faceNum.map(() => (
				<Face info={info} />
			))}
		</UnitContainer>
	);
}
