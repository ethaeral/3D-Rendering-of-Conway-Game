export function randomNumber(range) {
	return Math.floor(Math.random() * range);
}

export function randomRGBColorGen() {
	let color = [];
	for (let i = 0; i < 3; i++) {
		const num = randomNumber(225);
		color.push(num);
	}
	return `${color[0]}, ${color[1]}, ${color[2]}`;
}

// creates a 32 length string with random nums and characters
export function customUUID() {
	let newID = ``;
	for (let i = 0; i < 33; i++) {
		let num = randomNumber(100);
		if (num <= 25) {
			const charCode = String.fromCharCode(
				Math.floor(Math.random() * (90 - 65)) + 65
			);
			newID += charCode;
		} else {
			const nextNum = Math.floor(Math.random() * 10);
			newID += nextNum.toString();
		}
	}
	return newID;
}

export function stringKeyToInt(key) {
	const gpIdx = parseInt(key.charAt(0));
	const pIdx = parseInt(key.charAt(1));
	const cIdx = parseInt(key.charAt(2));
	return { gpIdx, pIdx, cIdx };
}
