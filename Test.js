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

console.log(randomColorGen());
