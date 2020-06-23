import { Unit } from "./UnitStructure";

const {
	randomNumber,
	randomRGBColorGen,
	stringKeyToInt,
} = require("./Helpers");

export function IIIDMatrix(n) {
	this.matrix = [];
	this.n = n;
	this.nodes = {};

	// creates n**3 matrix
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

	// calculates all possible points  checks within the bounds of current matrix
	// connects rooms and adjust entries of live neighbors accordingly in hashmap
	this.matrixGenCxn = function () {
		const diffX = [-1, 0, 1];
		const diffY = [-1, 0, 1];
		const diffZ = [-1, 0, 1];
		for (let node of Object.keys(this.nodes)) {
			const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
			for (let dx in diffX) {
				for (let dy in diffY) {
					for (let dz in diffZ) {
						try {
							const nx = parseInt(diffX[dx]) + cIdx;
							const ny = parseInt(diffY[dy]) + pIdx;
							const nz = parseInt(diffZ[dz]) + gpIdx;
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

	// checks hashmap for and seperate states based on possible
	// state change of alive or dead - execute state then adjust hashmap
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
			const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
			if (this.matrix[gpIdx][pIdx][cIdx].isAlive === false) {
				this.matrix[gpIdx][pIdx][cIdx].isAlive = true;
				this.setAliveNeighborCount(node, true);
			}
		}
		for (let node of expire) {
			const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
			if (this.matrix[gpIdx][pIdx][cIdx].isAlive === true) {
				this.matrix[gpIdx][pIdx][cIdx].isAlive = false;
				this.setAliveNeighborCount(node, false);
			}
		}
	};

	// iterate over matrix to replace null value with a new Unit
	// determines whethere unit is alive and what color it holds
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

	// creates a new state for the matrix
	// adjust matrix and hashmap to reflect changes
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

	// set all entries in hashmap and matrix to reflect all units are dead
	this.clearLivingState = function () {
		for (let node of Object.keys(this.nodes)) {
			const { gpIdx, pIdx, cIdx } = stringKeyToInt(node);
			this.nodes[node].livingNeighbors = 0;
			this.matrix[gpIdx][pIdx][cIdx].isAlive = false;
		}
	};

	// adjust hashmap to reflect if a unit dies to adjust its neighbors as well
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
