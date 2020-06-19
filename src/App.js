import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import "./App.css";

import { AppContainer, Controls, RightClip, Buttons, Slider } from "./styles";
import { IIIDMatrix } from "./utils/3DMatrixStructure";

function App() {
	const instantiateMtrx = (x) => {
		const mtrx = new IIIDMatrix(x);
		mtrx.genMatrix();
		mtrx.resetState();
		return mtrx;
	};
	const [counter, setCounter] = useState(0);
	const [onGoing, setOnGoing] = useState(false);
	const [animation, setAnimation] = useState(false);
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

	const implementChangeState = () => {
		let num = counter + 1;
		setCounter(num);
		matrices[n].applyRuleToState();
	};

	useEffect(() => {
		if (onGoing === true) {
			setTimeout(implementChangeState, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter]);

	return (
		<AppContainer>
			<Main
				animation={animation}
				matrix={matrices[n].matrix}
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
								matrices[n].resetState();
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
