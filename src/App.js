import React, { useEffect, useState, useCallback } from "react";
import Main from "./components/Main";
import "./App.css";

import { AppContainer, Controls, RightClip, Buttons, Slider } from "./styles";
import { IIIDMatrix } from "./utils/3DMatrixStructure";

function App() {
	const instantiateMtrx = (x) => {
		const m = new IIIDMatrix(x);
		m.genMatrix();
		m.matrixGenCxn();
		return m;
	};
	const [counter, setCounter] = useState(0);
	const [onGoing, setOnGoing] = useState(false);
	const [animation, setAnimation] = useState(false);
	const [outline, setOutline] = useState(true);
	const [n, setN] = useState(1);
	const [matrices] = useState({
		1: instantiateMtrx(1),
		2: instantiateMtrx(2),
		3: instantiateMtrx(3),
		4: instantiateMtrx(4),
		5: instantiateMtrx(5),
		6: instantiateMtrx(6),
		7: instantiateMtrx(7),
		8: instantiateMtrx(8),
		9: instantiateMtrx(9),
		10: instantiateMtrx(10),
	});
	const [curr, setCurr] = useState(matrices[1].matrix);

	const implementChangeState = useCallback(() => {
		let num = counter + 1;
		setCounter(num);
		matrices[n].applyRuleToState();
	}, [counter, matrices, n]);

	useEffect(() => {
		if (onGoing === true) {
			setTimeout(implementChangeState, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter, implementChangeState]);

	return (
		<AppContainer>
			<Main
				animation={animation}
				matrix={curr}
				outline={outline}
				counter={counter}
			/>
			<Controls>
				<RightClip>
					<p>Generation: {`${counter}`}</p>
					<Buttons>
						<button
							onClick={() => {
								animation[n] === true
									? setAnimation(false)
									: setAnimation(true);
							}}>
							{animation[n] === true ? "Interactive" : "Animation"}
						</button>
						<button
							onClick={() => {
								onGoing[n] === true ? setOnGoing(false) : setOnGoing(true);
							}}>
							{onGoing[n] === true ? "Pause" : "Start"}
						</button>
						<button
							onClick={() => {
								setCounter(0);
								matrices[n].randomizeState();
							}}>
							Reset
						</button>
						<button
							onClick={() => {
								setOutline(!outline);
							}}>
							Outline
						</button>
						<button
							onClick={() => {
								implementChangeState();
							}}>
							Next
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
							const newN = parseInt(e.target.value);
							setN(newN);
							setCurr(matrices[newN].matrix);
							setCounter(0);
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
