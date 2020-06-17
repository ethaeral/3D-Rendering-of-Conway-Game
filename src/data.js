class Room {
	constructor(
		id,
		x,
		y,
		isAlive = false,
		n_to = null,
		s_to = null,
		e_to = null,
		w_to = null,
		ne_to = null,
		nw_to = null,
		se_to = null,
		sw_to = null
	) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.isAlive = isAlive;
		this.n_to = n_to;
		this.s_to = s_to;
		this.e_to = e_to;
		this.w_to = w_to;
		this.ne_to = ne_to;
		this.nw_to = nw_to;
		this.se_to = se_to;
		this.sw_to = sw_to;
	}

	connectRoom(room, dir) {
		this[`${dir}_to`] = room;
	}

	getAllAlive() {
		let alive = [];
		const dir = [
			this.n_to,
			this.ne_to,
			this.nw_to,
			this.s_to,
			this.se_to,
			this.sw_to,
			this.e_to,
			this.w_to,
		];
		for (let i = 0; i < dir.length; i++) {
			if (dir[i]) {
				if (dir[i].isAlive === true) {
					alive.push(dir[i]);
				}
			}
		}

		return alive.length;
	}
}

function connectRooms(matrix) {
	const diffX = [-1, 0, 1];
	const diffY = [-1, 0, 1];
	const dir = ["nw", "w", "sw", "s", "n", "se", "e", "ne"];
	matrix.forEach((array, arrIdx) => {
		matrix.forEach((entry, entryIdx) => {
			let dirCount = 0;
			for (let di in diffX) {
				for (let dj in diffY) {
					try {
						const nx = diffX[di] + entryIdx;
						const ny = diffY[dj] + arrIdx;
						if (
							Math.min(ny, nx) >= 0 &&
							matrix[ny][nx] &&
							matrix[ny][nx] !== matrix[arrIdx][entryIdx]
						) {
							matrix[arrIdx][entryIdx].connectRoom(
								matrix[ny][nx],
								dir[dirCount]
							);
							dirCount += 1;
						}
					} catch (err) {
						console.log(err.message);
					}
				}
			}
		});
	});
}

export function generateRooms(nByN) {
	const grid = Array(nByN).fill(null);
	const roomsAmount = nByN ** 2;
	let roomCount = 0;
	grid.forEach((item, idx) => {
		grid[idx] = Array(nByN).fill(null);
	});

	while (roomCount < roomsAmount) {
		const xCoord = roomCount % nByN;
		const yCoord = Math.floor(roomCount / nByN);
		const roomId = roomCount;
		grid[yCoord][xCoord] = new Room(roomId, xCoord, yCoord);
		roomCount += 1;
	}
	connectRooms(grid);
	return grid;
}

export const Rooms = generateRooms(20);
