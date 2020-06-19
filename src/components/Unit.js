import React from "react";

import { UnitContainer } from "../styles";
import Face from "./Face";

export default function Unit({ info,  }) {
	const faceNum = [0, 0, 0, 0, 0, 0];
	return (
		<UnitContainer>
			{faceNum.map((face,idx) => (
				<Face key={`${idx << 6}`} info={info} />
			))}
		</UnitContainer>
	);
}
