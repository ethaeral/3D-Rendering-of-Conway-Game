function Unit(id, x, y, z) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.isAlive = false;
	this.color = this.npo = null;
	this.opo = null;
	this.ppo = null;
	this.noo = null;
	this.ooo = null;
	this.poo = null;
	this.nno = null;
	this.ono = null;
	this.pno = null;
	this.npp = null;
	this.opo = null;
	this.ppp = null;
	this.nop = null;
	this.oop = null;
	this.pop = null;
	this.nnp = null;
	this.onp = null;
	this.pnp = null;
	this.npn = null;
	this.opn = null;
	this.ppn = null;
	this.non = null;
	this.oon = null;
	this.pon = null;
	this.nnn = null;
	this.onn = null;
	this.pnn = null;

	this.connectRooms = function (room, dir) {
		this[`${dir}`] = room;
	};
	this.getAllNeighbors = function () {
		let neighbors = [];
		const dir = [
			this.npo,
			this.opo,
			this.ppo,
			this.noo,
			this.ooo,
			this.poo,
			this.nno,
			this.ono,
			this.pno,
			this.npp,
			this.opo,
			this.ppp,
			this.nop,
			this.oop,
			this.pop,
			this.nnp,
			this.onp,
			this.pnp,
			this.npn,
			this.opn,
			this.ppn,
			this.non,
			this.oon,
			this.pon,
			this.nnn,
			this.onn,
			this.pnn,
		];
		for (let i = 0; i < dir.length; i++) {
			neighbors.push(dir[i]);
		}

		return neighbors;
	};

	this.getAllAlive = function () {
		let alive = [];
		const dir = [
			this.npo,
			this.opo,
			this.ppo,
			this.noo,
			this.ooo,
			this.poo,
			this.nno,
			this.ono,
			this.pno,
			this.npp,
			this.opo,
			this.ppp,
			this.nop,
			this.oop,
			this.pop,
			this.nnp,
			this.onp,
			this.pnp,
			this.npn,
			this.opn,
			this.ppn,
			this.non,
			this.oon,
			this.pon,
			this.nnn,
			this.onn,
			this.pnn,
		];
		for (let i = 0; i < dir.length; i++) {
			if (dir[i]) {
				if (dir[i].isAlive === true) {
					alive.push(dir[i]);
				}
			}
		}

		return alive.length;
	};
}

function IIIDGenCxn(matrix) {
	const diffX = [-1, 0, 1];
	const diffY = [-1, 0, 1];
	const diffZ = [-1, 0, 1];
	matrix.forEach((gp, gpIdx) => {
		matrix.forEach((p, pIdx) => {
			matrix.forEach((c, cIdx) => {
				for (let dx in diffX) {
					for (let dy in diffY) {
						for (let dz in diffZ) {
							try {
								const nx = diffX[dx] + cIdx;
								const ny = diffY[dy] + pIdx;
								const nz = diffZ[dz] + gpIdx;
								if (
									Math.min(ny, nx, nz) >= 0 &&
									matrix[nz][ny][nx] &&
									matrix[nz][ny][nx] !== matrix[gpIdx][pIdx][cIdx]
								) {
									const dirMap = { "-1": "n", "1": "p", "0": "o" };

									matrix[gpIdx][pIdx][cIdx].connectRooms(
										matrix[nz][ny][nx],
										`${dirMap[diffX[dx]]}${dirMap[diffY[dy]]}${
											dirMap[diffZ[dz]]
										}`
									);
								}
							} catch (err) {
								continue;
							}
						}
					}
				}
			});
		});
	});
}

function randomNumber(range) {
	return Math.floor(Math.random() * range);
}

function randomColorGen() {
	let color = [];
	for (let i = 0; i < 3; i++) {
		const num = randomNumber(225);
		if (i === 3) {
			color.push(num);
		} else {
			color.push(num);
		}
	}
	return `${color[0]}, ${color[1]}, ${color[2]}`;
}

function generateIIIMatrix(n) {
	const grid = Array(n).fill(null);
	const roomsAmount = n ** 3;
	const matrixRoomAmount = n ** 2;
	let roomCount = 0;
	let matrixIdx = 0;
	let matrixRoomCount = 0;
	grid.forEach((grandparent, gpIdx) => {
		const innerGrid = Array(n).fill(null);
		innerGrid.forEach((parent, pIdx) => {
			innerGrid[pIdx] = Array(n).fill(null);
		});
		grid[gpIdx] = innerGrid;
	});
	while (roomCount < roomsAmount) {
		if (matrixRoomCount === matrixRoomAmount) {
			matrixIdx += 1;
			matrixRoomCount = 0;
		}
		const xCoord = matrixRoomCount % n;
		const yCoord = Math.floor(matrixRoomCount / n);
		const zCoord = matrixIdx;
		grid[zCoord][yCoord][xCoord] = new Unit(roomCount, xCoord, yCoord, zCoord);
		const threshold = 25;
		const randomNum = randomNumber(100);
		if (randomNum < threshold) {
			grid[zCoord][yCoord][xCoord].isAlive = true;
		}
		grid[zCoord][yCoord][xCoord].color = randomColorGen();
		matrixRoomCount += 1;
		roomCount += 1;
	}
	IIIDGenCxn(grid);
	return grid;
}

export const matrix = generateIIIMatrix(10);
