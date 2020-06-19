import React  from "react";

import Matrix from "./Matrix";
import { MainContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Main({ animation, matrix }) {
	return (
		<MainContainer animation={animation}>
			{matrix.map((MDMatrix) => {
				return <Matrix key={`${customUUID()}`} MDMatrix={MDMatrix} />;
			})}
		</MainContainer>
	);
}
export default React.memo(Main);
