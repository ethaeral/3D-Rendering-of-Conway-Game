import styled from "styled-components";

export const AppContainer = styled.div`
	margin: 0 auto;
	display: flex;
	p {
		font-size: 0.5em;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
			Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}
`;

export const Controls = styled.div`
	position: absolute;
	top: 40px;
	left: 60px;
	z-index: 50;
	display: flex;
`;

export const RightClip = styled.div``;

export const Buttons = styled.div`
	margin-top: 5px;
	display: flex;
	flex-direction: column;
	button {
		margin-bottom: 5px;
		background: #2196f3;
		color: white;
		font-weight: 700;
		border: 1px white solid;
		border-radius: 10px;
	}
`;

export const Slider = styled.div`
	padding-top: 20px;
	padding-right: 20px;
	.slider {
		-webkit-appearance: slider-vertical;
		width: 120px;
	}
`;

export const MainContainer = styled.div`
	transform-style: preserve-3d;
	position: absolute;
	transform: ${(props) =>
		props.yTrans && props.xTrans
			? `rotateX(${props.xTrans}deg) rotateY(${props.yTrans}deg)`
			: "none"};
	animation: ${(props) => (props.animation ? "r 60s linear infinite" : "none")};
	top: 50vh;
	left: 50vw;
	@keyframes r {
		to {
			transform: rotateY(1turn) rotateX(1turn) rotateZ(1turn);
		}
	}
`;
export const WindowContainer = styled.div`
	position: absolute;
	transform-style: preserve-3d;
	&:nth-child(1) {
		transform: translate3d(-1em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(2) {
		transform: translate3d(-2em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(3) {
		transform: translate3d(-3em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(4) {
		transform: translate3d(-4em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(5) {
		transform: translate3d(-5em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(6) {
		transform: translate3d(-6em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(7) {
		transform: translate3d(-7em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(8) {
		transform: translate3d(-8em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(9) {
		transform: translate3d(-9em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(10) {
		transform: translate3d(-10em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
`;

export const RowContainer = styled.div`
	position: absolute;
	transform-style: preserve-3d;
	&:nth-child(1) {
		top: 10vh;
	}
	&:nth-child(2) {
		top: 20vh;
	}
	&:nth-child(3) {
		top: 30vh;
	}
	&:nth-child(4) {
		top: 40vh;
	}
	&:nth-child(5) {
		top: 50vh;
	}
	&:nth-child(6) {
		top: 60vh;
	}
	&:nth-child(7) {
		top: 70vh;
	}
	&:nth-child(8) {
		top: 80vh;
	}
	&:nth-child(9) {
		top: 90vh;
	}
	&:nth-child(10) {
		top: 100vh;
	}
`;

export const UnitContainer = styled.div`
	position: absolute;
	transform-style: preserve-3d;
	&:nth-child(1) {
		transform: translate3d(0em, 0em, 0em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(2) {
		transform: translate3d(0em, 0em, 2em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(3) {
		transform: translate3d(0em, 0em, 4em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(4) {
		transform: translate3d(0em, 0em, 6em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(5) {
		transform: translate3d(0em, 0em, 8em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(6) {
		transform: translate3d(0em, 0em, 10em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(7) {
		transform: translate3d(0em, 0em, 12em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(8) {
		transform: translate3d(0em, 0em, 14em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(9) {
		transform: translate3d(0em, 0em, 16em) scale3d(0.75, 0.75, 0.75);
	}
	&:nth-child(10) {
		transform: translate3d(0em, 0em, 18em) scale3d(0.75, 0.75, 0.75);
	}
`;

export const FaceContainer = styled.div`
	position: absolute;
	width: 2.5em;
	height: 2.5em;
	box-shadow: ${(props) =>
		props.outline || props.isAlive ? "inset 0 0 1px" : "none"};
	background: ${(props) =>
		props.isAlive ? `rgba(${props.color}, 0.3) ` : `rgba(255, 255, 255, 0) `};
	&:nth-child(1) {
		transform: rotateY(0deg) translateZ(1.25em);
	}
	&:nth-child(2) {
		transform: rotateY(90deg) translateZ(1.25em);
	}
	&:nth-child(3) {
		transform: rotateY(180deg) translateZ(1.25em);
	}
	&:nth-child(4) {
		transform: rotateY(270deg) translateZ(1.25em);
	}
	&:nth-child(5) {
		transform: ${(props) =>
			`rotateX(${props.fifthCalc}deg) translateZ(1.25em)`};
	}
	&:nth-child(6) {
		transform: ${(props) =>
			`rotateX(${props.sixthCalc}deg) translateZ(1.25em)`};
	}
`;

export const DragContainer = styled.div`
	margin: 0 auto;
	width: 95vw;
	height: 99vh;
`;

export const SwitchContainer = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin-bottom: 5px;
	span {
		border-radius: 10px;
		background: ${(props) => (props.checked ? "#2196F3" : "gray")};
		width: 30px;
		height: 15px;
		border: 1px gray solid;
		display: flex;
		align-items: center;
		justify-content: ${(props) => (props.checked ? "flex-end" : "flex-start")};
		margin-right: 10px;
		.slider {
			margin-left: 3px;
			margin-right: 3px;
			background: white;
			width: 14px;
			height: 14px;
			border-radius: 100%;
		}
	}
	p {
		font-size: 0.4em;
	}
`;
