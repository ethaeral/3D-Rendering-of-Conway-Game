import React from "react";
import Unit from "./Unit";
import { RowContainer } from "../styles";
import { customUUID } from "../utils/Helpers";

function Row({ array }) {
	return (
		<RowContainer>
			{array.map((unit, idx) => (
				<Unit key={`${customUUID()}`} info={unit} />
			))}
		</RowContainer>
	);
}
export default React.memo(Row);
