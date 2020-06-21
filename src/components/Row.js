import React from "react";
import Unit from "./Unit";
import { RowContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Row({ array, outline }) {
	return (
		<RowContainer>
			{array.map((unit) => (
				<Unit key={`${customUUID()}`} info={unit} outline={outline} />
			))}
		</RowContainer>
	);
}
export default React.memo(Row);
