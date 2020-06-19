function Unit(id, x, y, z) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.isAlive = false;
	this.color = null;
	this.npo = null;
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

function randomNumber(range) {
	return Math.floor(Math.random() * range);
}

function randomRGBColorGen() {
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

function IIIDMatrix(n) {
	this.matrix = [];
	this.n = n;
	this.nodes = {};
	this.genMatrix = function () {
		const matrix = Array(this.n).fill(null);
		matrix.forEach((grandparent, gpIdx) => {
			const innerMatrix = Array(this.n).fill(null);
			innerMatrix.forEach((parent, pIdx) => {
				innerMatrix[pIdx] = Array(this.n).fill(null);
			});
			matrix[gpIdx] = innerMatrix;
		});
		this.matrix = matrix;
		this.createNodes();
	};

	this.matrixGenCxn = function () {
		const diffX = [-1, 0, 1];
		const diffY = [-1, 0, 1];
		const diffZ = [-1, 0, 1];
		for (let node of Object.keys(this.nodes)) {
			const gpIdx = node.charAt(0);
			const pIdx = node.charAt(1);
			const cIdx = node.charAt(2);
			for (let dx in diffX) {
				for (let dy in diffY) {
					for (let dz in diffZ) {
						try {
							const nx = parseInt(diffX[dx]) + parseInt(cIdx);
							const ny = parseInt(diffY[dy]) + parseInt(pIdx);
							const nz = parseInt(diffZ[dz]) + parseInt(gpIdx);
							if (
								Math.min(ny, nx, nz) >= 0 &&
								this.matrix[nz][ny][nx] &&
								this.matrix[nz][ny][nx] !== this.matrix[gpIdx][pIdx][cIdx]
							) {
								const dirMap = { "-1": "n", "1": "p", "0": "o" };
								this.matrix[gpIdx][pIdx][cIdx].connectRooms(
									this.matrix[nz][ny][nx],
									`${dirMap[diffX[dx]]}${dirMap[diffY[dy]]}${dirMap[diffZ[dz]]}`
								);
								this.nodes[node].neighbors.push(`${nz}${ny}${nx}`);
								if (this.matrix[nz][ny][nx].isAlive === true) {
									this.nodes[node].livingNeighbors += 1;
								}
							}
						} catch (err) {
							continue;
						}
					}
				}
			}
		}
	};

	this.applyRuleToState = function () {
		let reanimate = [];
		let expire = [];
		for (let node of Object.keys(this.nodes)) {
			const neighborsAliveNum = this.nodes[node].livingNeighbors;
			if (neighborsAliveNum < 2 || neighborsAliveNum >= 4) {
				expire.push(node);
			} else if (neighborsAliveNum === 3) {
				reanimate.push(node);
			}
		}
		for (let node of reanimate) {
			const gpIdx = parseInt(node.charAt(0));
			const pIdx = parseInt(node.charAt(1));
			const cIdx = parseInt(node.charAt(2));
			this.matrix[gpIdx][pIdx][cIdx].isAlive = true;
			this.setAliveNeighborCount(node, true);
		}
		for (let node of expire) {
			const gpIdx = parseInt(node.charAt(0));
			const pIdx = parseInt(node.charAt(1));
			const cIdx = parseInt(node.charAt(2));
			this.matrix[gpIdx][pIdx][cIdx].isAlive = false;
			this.setAliveNeighborCount(node, false);
		}
	};

	this.createNodes = function () {
		const roomsAmount = this.n ** 3;
		const matrixRoomAmount = this.n ** 2;
		let roomCount = 0;
		let matrixIdx = 0;
		let matrixRoomCount = 0;
		while (roomCount < roomsAmount) {
			if (matrixRoomCount === matrixRoomAmount) {
				matrixIdx += 1;
				matrixRoomCount = 0;
			}
			const xCoord = matrixRoomCount % this.n;
			const yCoord = Math.floor(matrixRoomCount / this.n);
			const zCoord = matrixIdx;
			this.matrix[zCoord][yCoord][xCoord] = new Unit(
				roomCount,
				xCoord,
				yCoord,
				zCoord
			);
			this.nodes[`${zCoord}${yCoord}${xCoord}`] = {
				livingNeighbors: 0,
				neighbors: [],
			};
			const threshold = 25;
			const randomNum = randomNumber(100);
			if (randomNum < threshold) {
				this.matrix[zCoord][yCoord][xCoord].isAlive = true;
			}
			this.matrix[zCoord][yCoord][xCoord].color = randomRGBColorGen();
			matrixRoomCount += 1;
			roomCount += 1;
		}
	};

	this.randomizeState = function () {
		this.clearLivingState();
		const roomsAmount = this.n ** 3;
		const matrixRoomAmount = this.n ** 2;
		let roomCount = 0;
		let matrixIdx = 0;
		let matrixRoomCount = 0;
		while (roomCount < roomsAmount) {
			if (matrixRoomCount === matrixRoomAmount) {
				matrixIdx += 1;
				matrixRoomCount = 0;
			}
			const xCoord = matrixRoomCount % this.n;
			const yCoord = Math.floor(matrixRoomCount / this.n);
			const zCoord = matrixIdx;
			const threshold = 25;
			const randomNum = randomNumber(100);
			if (randomNum < threshold) {
				this.matrix[zCoord][yCoord][xCoord].isAlive = true;
				this.setAliveNeighborCount(`${zCoord}${yCoord}${xCoord}`, true);
			}
			this.matrix[zCoord][yCoord][xCoord].color = randomRGBColorGen();
			matrixRoomCount += 1;
			roomCount += 1;
		}
	};

	this.clearLivingState = function () {
		for (let node of Object.keys(this.nodes)) {
			this.nodes[node].livingNeighbors = 0;
		}
	};

	this.setAliveNeighborCount = function (node, inc) {
		for (let neighbor of this.nodes[node].neighbors) {
			if (inc === true) {
				this.nodes[neighbor].livingNeighbors =
					this.nodes[neighbor].livingNeighbors + 1;
			} else if (this.nodes[neighbor].livingNeighbors > 0) {
				this.nodes[neighbor].livingNeighbors =
					this.nodes[neighbor].livingNeighbors - 1;
			}
		}
	};
}

const m = new IIIDMatrix(3);
m.genMatrix();
m.matrixGenCxn();
m.randomizeState();
console.log(m.nodes);
