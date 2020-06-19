import React  from "react";
import { customUUID } from "../utils/Helpers";
import Row from "./Row";
import { WindowContainer } from "../styles";

function Matrix({ MDMatrix }) {
	return (
		<WindowContainer>
			{MDMatrix.map((array) => {
				return <Row key={`${customUUID()}`} array={array} />;
			})}
		</WindowContainer>
	);
}
export default React.memo(Matrix);
