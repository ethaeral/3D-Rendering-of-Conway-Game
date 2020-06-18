import React, { useEffect, useState } from "react";
import Main from "./Main";
import "./App.css";

import { generateIIIMatrix, changeState, randomize } from "./matrixGen";

import { AppContainer, Controls, RightClip, Buttons, Slider } from "./styles";

function App() {
	const cache = {
		1: generateIIIMatrix(1),
		2: generateIIIMatrix(2),
		3: generateIIIMatrix(3),
		4: generateIIIMatrix(4),
		5: generateIIIMatrix(5),
		6: generateIIIMatrix(6),
		7: generateIIIMatrix(7),
		8: generateIIIMatrix(8),
		9: generateIIIMatrix(9),
		10: generateIIIMatrix(10),
	};
	const [onGoing, setOnGoing] = useState(false);
	const [counter, setCounter] = useState(0);
	const [animation, setAnimation] = useState(false);
	const [n, setN] = useState(1);
	const [curr, setCurr] = useState(cache[n]);

	const implementChangeState = () => {
		let num = counter + 1;
		setCounter(num);
		changeState(curr);
	};

	useEffect(() => {
		if (onGoing === true) {
			setTimeout(implementChangeState, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter]);

	return (
		<AppContainer>
			<Main animation={animation} matrix={curr} />
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
								randomize(curr, n);
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
							setCurr(cache[n]);
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
