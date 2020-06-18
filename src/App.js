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
	const counterInitial = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
	};
	const initialState = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
		10: false,
	};
	const [counter, setCounter] = useState({
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
	});
	const [onGoing, setOnGoing] = useState(initialState);
	const [animation, setAnimation] = useState(initialState);
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
		setCounter({ ...counterInitial, [n]: num });
		matrices[n].applyRuleToState();
	};

	useEffect(() => {
		if (onGoing[n] === true) {
			setTimeout(implementChangeState, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoing, counter]);

	return (
		<AppContainer>
			<Main
				animation={animation[1]}
				matrix={matrices[1].matrix}
				counter={counter[1]}
				visible={n === 1}
			/>
			<Main
				animation={animation[2]}
				matrix={matrices[2].matrix}
				counter={counter[2]}
				visible={n === 2}
			/>
			<Main
				animation={animation[3]}
				matrix={matrices[3].matrix}
				counter={counter[3]}
				visible={n === 3}
			/>
			<Main
				animation={animation[4]}
				matrix={matrices[4].matrix}
				counter={counter[4]}
				visible={n === 4}
			/>
			<Main
				animation={animation[5]}
				matrix={matrices[5].matrix}
				counter={counter[5]}
				visible={n === 5}
			/>
			<Main
				animation={animation[6]}
				matrix={matrices[6].matrix}
				counter={counter[6]}
				visible={n === 6}
			/>
			<Main
				animation={animation[7]}
				matrix={matrices[7].matrix}
				counter={counter[7]}
				visible={n === 7}
			/>
			<Main
				animation={animation[8]}
				matrix={matrices[8].matrix}
				counter={counter[8]}
				visible={n === 8}
			/>
			<Main
				animation={animation[9]}
				matrix={matrices[9].matrix}
				counter={counter[9]}
				visible={n === 9}
			/>
			<Main
				animation={animation[10]}
				matrix={matrices[10].matrix}
				counter={counter[10]}
				visible={n === 10}
			/>
			<Controls>
				<RightClip>
					<p>Generation: {counter[n]}</p>
					<Buttons>
						<button
							onClick={() => {
								animation[n] === true
									? setAnimation({ ...initialState, [n]: false })
									: setAnimation({ ...initialState, [n]: true });
							}}>
							{animation[n] === true ? "Interactive" : "Animation"}
						</button>
						<button
							onClick={() => {
								onGoing[n] === true
									? setOnGoing({ ...initialState, [n]: false })
									: setOnGoing({ ...initialState, [n]: true });
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
