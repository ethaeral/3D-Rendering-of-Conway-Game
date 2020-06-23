import React from "react";
import { ModalContainer, ModalWindow, TopBar, Exit, Message } from "../styles";

export default function Modal({ state, setState }) {
	return (
		<ModalContainer display={state}>
			<ModalWindow>
				<TopBar>
					<Exit
						onClick={(e) => {
							e.stopPropagation();
							console.log("b");
							setState(false);
						}}>
						<p>x</p>
					</Exit>
					<Message>
						<p>
							The Game of Life by John Conway is a cellular automaton.
							<br />
							The rules the cell follows where l = living neighbors
							<br />
							Living cells: Cells will die if l is less than 2 and l is more or
							equal to four
							<br />
							Dead cells: Will come alive if l is equal to 3
							<br /> The 3D rendering leverages graphs, hashmaps, and styled
							components.
							<br />
						</p>
						<a href='https://github.com/richanynguon/3d_matrix_rendering'>
							Github
						</a>
					</Message>
				</TopBar>
			</ModalWindow>
		</ModalContainer>
	);
}
