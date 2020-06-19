import React from "react";

import { UnitContainer } from "../styles";
import Face from "./Face";
import { customUUID } from "../utils/Helpers";

function Unit({ info }) {
	const faceNum = [0, 0, 0, 0, 0, 0];
	return (
		<UnitContainer>
			{faceNum.map((face, idx) => (
				<Face key={`${customUUID()}`} info={info} />
			))}
		</UnitContainer>
	);
}
export default React.memo(Unit);
