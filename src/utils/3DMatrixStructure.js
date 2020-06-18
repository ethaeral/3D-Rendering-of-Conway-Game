const {
	matrixWalker,
	createNodes,
	randomizeState,
	setAliveNeighborCount,
} = require("./Helpers");

export function IIIDMatrix(n) {
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
		matrixWalker(matrix, this.n, createNodes, this.nodes);
		this.matrix = matrix;
		this.matrixGenCxn();
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
							const nx = diffX[dx] + cIdx;
							const ny = diffY[dy] + pIdx;
							const nz = diffZ[dz] + gpIdx;
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
								this.nodes[node].neighbors.add(`${nz}${ny}${nx}`);
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

	this.resetState = function () {
		matrixWalker(this.matrix, n, randomizeState, this.nodes);
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
			this.storage[gpIdx][pIdx][cIdx].isAlive = true;
			setAliveNeighborCount(node, this.nodes, true);
		}
		for (let node of expire) {
			const gpIdx = parseInt(node.charAt(0));
			const pIdx = parseInt(node.charAt(1));
			const cIdx = parseInt(node.charAt(2));
			this.storage[gpIdx][pIdx][cIdx].isAlive = false;
			setAliveNeighborCount(node, this.nodes, false);
		}
	};
}
