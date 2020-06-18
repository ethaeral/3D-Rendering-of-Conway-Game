export function Unit(id, x, y, z) {
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