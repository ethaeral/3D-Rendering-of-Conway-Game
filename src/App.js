import React, { useEffect, useState } from "react";
import Main from "./Main";
import "./App.css";
import { matrix, changeState } from "./matrixGen";

import { AppContainer } from "./styles";

function App() {
	const [onGoing, setOnGoing] = useState(false);
	const [counter, setCounter] = useState(false);
	const implementChangeState = () => {
		let num = counter + 1;
		setCounter(num);
		changeState(matrix);
	};
	useEffect(() => {
		if (onGoing === true) {
			setTimeout(implementChangeState, 1000 );
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter]);

	return (
		<AppContainer>
			<button
				onClick={() => {
					onGoing === true ? setOnGoing(false) : setOnGoing(true);
				}}>
				{onGoing === true ? "Pause" : "Start"}
			</button>
			<Main />
		</AppContainer>
	);
}

export default App;
