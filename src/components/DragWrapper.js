import React, { useState } from "react";
import { DragContainer } from "../styles";

export default function DragWrapper(props) {
	const { animation, matrix, outline, counter } = props;
	const [prev, setPrev] = useState({ x: null, y: null });
	const [trans, setTrans] = useState({ x: null, y: null });
	const [angle, setAngle] = useState({ x: 0, y: 0 });
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
				console.log(e.clientX + cursorX - prev.x, e.clientY + cursorY - prev.y);
				const deltaX = (e.clientX + cursorX - prev.x)/2;
				const deltaY = (e.clientY + cursorY - prev.y)/2;
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					setAngle({ ...angle, y: angle.x + deltaX });
				} else {
					setAngle({ ...angle, x: angle.y + deltaY });
				}
				console.log(angle);
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
