export function Unit(id, x, y, z) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.isAlive = false;
	this.color = null;
	/*	 
			[x,y,z]
			_________  _________   _________
			|_-1, 1,-1_|_ 0, 1,-1_|_ 1, 1,-1_|
			|_-1, 0,-1_|_ 0, 0,-1_|_ 1, 0,-1_|
			|_-1,-1,-1_|_ 0,-1,-1_|_ 1,-1,-1_|
 			 _________  _________   _________
			|_-1, 1, 0_|_ 0, 1, 0_|_ 1, 1, 0_|
			|_-1, 0, 0_|_ 0, 0, 0_|_ 1, 0, 0_|
			|_-1,-1, 0_|_ 0,-1, 0_|_ 1,-1, 0_|
			 _________  _________   _________
			|_-1, 1, 1_|_ 0, 1, 1_|_ 1, 1, 1_|
			|_-1, 0, 1_|_ 0, 0, 1_|_ 1, 0, 1_|
			|_-1,-1, 1_|_ 0,-1, 1_|_ 1,-1, 1_|

			{1: p, -1: n, 0: o,}
			 _________  _________   _________
			|_ n, p, n_|_ o, p, n_|_ p, p, n_|
			|_ n, o, n_|_ o, o, n_|_ p, o, n_|
			|_ n, n, n_|_ o, n, n_|_ p, n, n_|
 			 _________  _________   _________
			|_ n, p, o_|_ o, p, o_|_ p, p, o_|
			|_ n, o, o_|_ o, o, o_|_ p, o, o_|
			|_ n, n, o_|_ o, n, o_|_ p, n, o_|
			 _________  _________   _________
			|_ n, p, p_|_ o, p, p_|_ p, p, p_|
			|_ n, o, p_|_ o, o, p_|_ p, o, p_|
			|_ n, n, p_|_ o, n, p_|_ p, n, p_|

			Each cube will have a possible of 26 neighbors the naming convention
			reflects the distance from the origin point or current point
	*/
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
}
