import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import "./App.css";

import { AppContainer, Controls, RightClip, Buttons, Slider } from "./styles";
import { IIIDMatrix } from "./utils/3DMatrixStructure";

function App() {
	const [onGoing, setOnGoing] = useState(false);
	const [counter, setCounter] = useState(0);
	const [animation, setAnimation] = useState(false);
	const [n, setN] = useState(1);

	const implementChangeState = () => {
		let num = counter + 1;
		setCounter(num);
		// change state func
	};
	const instantiateMtrx = () => {
		const mtrx = new IIIDMatrix(n);
		mtrx.genMatrix();
		mtrx.resetState();
		return mtrx.matrix;
	};
	const [curr, setCurr] = useState(instantiateMtrx());

	useEffect(() => {
		if (onGoing === true) {
			setTimeout(implementChangeState, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter, curr]);

	return (
		<AppContainer>
			<Main animation={animation} matrix={curr} counter={counter} n={n} />
			<Controls>
				<RightClip>
					<p>Generation: {counter}</p>
					<Buttons>
						<button
							onClick={() => {
								animation === true ? setAnimation(false) : setAnimation(true);
							}}>
							{animation === true ? "Interactive" : "Animation"}
						</button>
						<button
							onClick={() => {
								onGoing === true ? setOnGoing(false) : setOnGoing(true);
							}}>
							{onGoing === true ? "Pause" : "Start"}
						</button>
						<button
							onClick={() => {
								setCounter(0);
								//randomize state
							}}>
							Reset
						</button>
						<button onClick={() => {}}>About</button>
					</Buttons>
				</RightClip>
				<Slider>
					<input
						className='slider'
						type='range'
						min='1'
						max='10'
						list='tickmarks'
						defaultValue='1'
						onMouseUp={(e) => {
							setN(parseInt(e.target.value));
							setCurr();
						}}
					/>
					<datalist id='tickmarks'>
						<option value='1' />
						<option value='2' />
						<option value='3' />
						<option value='4' />
						<option value='5' />
						<option value='6' />
						<option value='7' />
						<option value='8' />
						<option value='9' />
						<option value='10' />
					</datalist>
				</Slider>
			</Controls>
		</AppContainer>
	);
}

export default App;
