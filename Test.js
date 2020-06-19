function randomNumber(range) {
	return Math.floor(Math.random() * range);
}

function customUUID() {
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

