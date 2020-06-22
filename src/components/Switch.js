import React, { useState } from "react";
import { SwitchContainer } from "../styles";

export default function Switch({ cb, state, title, checked }) {
	const [check, setCheck] = useState(checked);
	return (
		<SwitchContainer
			onClick={() => {
				cb(!state);
				setCheck(!check);
			}}
			checked={check}>
			<span>
				<div className='slider'></div>
			</span>
			<p>{title}</p>
		</SwitchContainer>
	);
}
