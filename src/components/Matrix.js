import React  from "react";
import { customUUID } from "../utils/Helpers";
import Row from "./Row";
import { WindowContainer } from "../styles";

function Matrix({ MDMatrix, outline }) {
	return (
		<WindowContainer>
			{MDMatrix.map((array) => {
				return <Row key={`${customUUID()}`} array={array} outline={outline}/>;
			})}
		</WindowContainer>
	);
}
export default React.memo(Matrix);
