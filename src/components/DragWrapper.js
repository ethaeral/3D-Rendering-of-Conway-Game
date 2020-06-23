import React, { useState } from "react";
import { DragContainer } from "../styles";

export default function DragWrapper(props) {
	const { animation, matrix, outline, counter } = props;
	const [prev, setPrev] = useState({ x: null, y: null });
	const [angle, setAngle] = useState({ x: 0, y: 0 });

	// specify where the cursor is regarding left top
	const cursorX = document.documentElement.scrollLeft
		? document.documentElement.scrollLeft
		: document.body.scrollLeft;
	const cursorY = document.documentElement.scrollTop
		? document.documentElement.scrollTop
		: document.body.scrollTop;
	
	// get left top of cursor before drag
	function getXY(e) {
		const crt = e.target.cloneNode(true);
		crt.style.opacity = 1;
		e.dataTransfer.setDragImage(crt, 0, 0);
		setPrev({
			x: e.clientX + cursorX,
			y: e.clientY + cursorY,
		});
	}
	// decides the greater change in cursor point from top or left
	function calcAngle(e) {
		const deltaX = (e.clientX + cursorX - prev.x) / 2;
		const deltaY = (e.clientY + cursorY - prev.y) / 2;
		if (!animation) {
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				setAngle({ ...angle, y: angle.x + deltaX });
			} else {
				setAngle({ ...angle, x: angle.y + deltaY });
			}
		}
	}

	return (
		<DragContainer
			draggable={!animation}
			onTouchStart={(e) => {
				getXY(e);
			}}
			onTouchMove={(e) => {
				calcAngle(e);
			}}
			onDragStart={(e) => {
				getXY(e);
			}}
			onDragEnd={(e) => {
				calcAngle(e);
			}}>
			<props.component
				animation={animation}
				matrix={matrix}
				outline={outline}
				counter={counter}
				xTrans={angle.x}
				yTrans={angle.y}
			/>
		</DragContainer>
	);
}
