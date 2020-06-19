import React from "react";

import Row from "./Row";
import { WindowContainer } from "../styles";


export default function Matrix({MDMatrix}) {

	return (
		<WindowContainer  >
			{MDMatrix.map((array, idx) => {
				return <Row  key={`${idx << 3}`} array={array}  />;
			})}
		</WindowContainer>
	);
}
