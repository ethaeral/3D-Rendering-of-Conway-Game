function Unit(id, x, y, z) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.isAlive = false;
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

function IIIDGen() {}

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
    console.log(zCoord,yCoord,xCoord)
		grid[zCoord][yCoord][xCoord] = new Unit(roomCount, xCoord, yCoord, zCoord);
		matrixRoomCount += 1;
		roomCount += 1;
	}
	return grid;
}

const matrix = generateIIIMatrix(3);
console.log(matrix);
