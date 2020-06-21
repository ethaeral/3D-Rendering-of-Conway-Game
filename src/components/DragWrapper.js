import React, { useState } from "react";
import { DragContainer } from "../styles";

export default function DragWrapper(props) {
	const { animation, matrix, outline, counter } = props;
	const [prev, setPrev] = useState({ x: null, y: null });
	const [delta, setDelta] = useState({ x: null, y: null });
	const [angle, setAngle] = useState(null);
	const cursorX = document.documentElement.scrollLeft
		? document.documentElement.scrollLeft
		: document.body.scrollLeft;
	const cursorY = document.documentElement.scrollTop
		? document.documentElement.scrollTop
		: document.body.scrollTop;
	return (
		<DragContainer
			draggable
			onDragStart={(e) => {
				const crt = e.target.cloneNode(true);
				crt.style.opacity = 1;
				e.dataTransfer.setDragImage(crt, 0, 0);
				setPrev({
					x: e.clientX + cursorX,
					y: e.clientY + cursorY,
				});
			}}
			onDragEnd={(e) => {
				const deltaX = e.clientX + cursorX - prev.x;
				const deltaY = e.clientY + cursorY - prev.y;
				setDelta({
					x: deltaX,
					y: deltaY,
				});

				let newAngle;
				if (deltaX < 0) {
					newAngle = 270 - (Math.atan(deltaY / -deltaX) * 180) / Math.PI;
				} else {
					newAngle = 90 + (Math.atan(deltaY / deltaX) * 180) / Math.PI;
				}
				setAngle(newAngle);
			}}>
			<props.component
				animation={animation}
				matrix={matrix}
				outline={outline}
				counter={counter}
				xTrans={angle}
				yTrans={angle}
			/>
		</DragContainer>
	);
}
