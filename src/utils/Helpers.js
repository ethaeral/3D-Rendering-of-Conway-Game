import { Unit } from "./UnitStructure";

export function randomNumber(range) {
	return Math.floor(Math.random() * range);
}

export function randomRGBColorGen() {
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

export function matrixWalker(mtrx, n, cb, nodeMap) {
	const roomsAmount = n ** 3;
	const matrixRoomAmount = n ** 2;
	let roomCount = 0;
	let matrixIdx = 0;
	let matrixRoomCount = 0;
	while (roomCount < roomsAmount) {
		if (matrixRoomCount === matrixRoomAmount) {
			matrixIdx += 1;
			matrixRoomCount = 0;
		}
		const xCoord = matrixRoomCount % n;
		const yCoord = Math.floor(matrixRoomCount / n);
		const zCoord = matrixIdx;
		cb(xCoord, yCoord, zCoord, mtrx, nodeMap, roomCount);
		matrixRoomCount += 1;
		roomCount += 1;
	}
}

export function createNodes(xCoord, yCoord, zCoord, mtrx, nodeMap, roomCount) {
	mtrx[zCoord][yCoord][xCoord] = new Unit(roomCount, xCoord, yCoord, zCoord);
	nodeMap[`${zCoord}${yCoord}${xCoord}`] = {
		livingNeighbors: 0,
		neighbors: new Set(),
	};
	const threshold = 25;
	const randomNum = randomNumber(100);
	if (randomNum < threshold) {
		mtrx[zCoord][yCoord][xCoord].isAlive = true;
	}
	mtrx[zCoord][yCoord][xCoord].color = randomRGBColorGen();
	
}

export function randomizeState(xCoord, yCoord, zCoord, mtrx, nodeMap) {
	clearLivingState(nodeMap);
	const threshold = 25;
	const randomNum = randomNumber(100);
	if (randomNum < threshold) {
		mtrx[zCoord][yCoord][xCoord].isAlive = true;
		setAliveNeighborCount(`${zCoord}${yCoord}${xCoord}`, nodeMap, true);
	} else {
		mtrx[zCoord][yCoord][xCoord].isAlive = false;
		setAliveNeighborCount(`${zCoord}${yCoord}${xCoord}`, nodeMap, false);
	}
	mtrx[zCoord][yCoord][xCoord].color = randomRGBColorGen();
}
function clearLivingState(nodeMap) {
	for (let node of Object.keys(nodeMap)) {
		nodeMap[node].livingNeighbors = 0;
	}
}

export function setAliveNeighborCount(node, nodeMap, inc) {
	for (let neighbor in nodeMap[node].neighbors) {
		if (inc === true) {
			nodeMap[neighbor].livingNeighbors += 1;
		} else {
			nodeMap[neighbor].livingNeighbors -= 1;
		}
	}
}
