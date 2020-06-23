import React from "react";

import { UnitContainer } from "../styles";
import Face from "./Face";
import { customUUID } from "../utils/Helpers";

function Unit({ info , outline}) {
	// creates 6 faces for a cube
	const faceNum = [0, 0, 0, 0, 0, 0];
	return (
		<UnitContainer>
			{faceNum.map((face) => (
				<Face key={`${customUUID()}`} info={info} outline={outline}/>
			))}
		</UnitContainer>
	);
}
export default React.memo(Unit);
