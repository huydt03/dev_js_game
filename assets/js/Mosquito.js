function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  // if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

let offset = [375, 667];

function ObjectBase(size, position, updateHandle = new Function){

	let deg = 0;

	let self = {size, position, deg};

	function init(){

		Object.defineProperties(self, {
			deg: {
				get: function(){ return deg; },
			},
			size: {
				get: function(){ return size; },
				set: function(value){
					size = value; 
					updateHandle(self);
				},
			},
			position: {
				get: function(){ return position; },
				set: function(value){
					deg = angle(position[0], position[1], value[0], value[1]);
					position = value;
					updateHandle(self);
				},
			}
		});

	}init();

	return self;

}

function AutoMoveObject(
	size,
	position = [],
	speed = [200, 1000],
	updateHandle = new Function
){

	let t_action;

	let self = {move, destroy, position, size, deg: 0};

	let base = new ObjectBase(size, position, e=>{
		updateHandle(self);
	});

	function destroy(){
		clearTimeout(t_action);
	}

	function doAction(){

		let x = Math.round(Math.random() * offset[0]);
		let y = Math.round(Math.random() * offset[1]);

		base.position = [x, y];

	}

	function move(){
		let n_range = speed[1] - speed[0];
		let n_time = Math.round(Math.random()*n_range) + speed[0];
		
		doAction(); //action

		clearTimeout(t_action);
		t_action = setTimeout(move, n_time);
	}

	function init(){

		Object.defineProperties(self, {
			move: {get: function(){ return move; }},
			destroy: {get: function(){ return destroy; }},
			size: {get: function(){ return base.size; }},
			position: {get: function(){ return base.position; }},
			deg: {get: function(){ return base.deg; }},
		});

	}init();

	return self;
}

export default function Mosquito(
	mosquitoHandle = new Function,
	mosquitoClickHandle = new Function,
	mosquitosHandle = new Function,
	timeHandle = new Function,
	levelHandle = new Function,
	playHandle = new Function,
	endHandle = new Function,
){

	const OPTIONS = {
		MAX_LEVEL: 666,
		LEVEL: 33,
		SIZE: 55,
		SCORE: 0,
		TIME: 30,
		TAKE: 5
	}

	let status = 0;

	let level = OPTIONS.LEVEL;

	let score = OPTIONS.SCORE;

	let n_time = OPTIONS.TIME;

	let mosquitos = {};

	let i_time;

	let self = {};

	function resize(width, height){
		offset = [width, height];
	}

	function click(id){
		remove(id);
		let length = Object.keys(mosquitos).length;

		if(status && length <= 0){
			self.level++;
			self.n_time += OPTIONS.TIME;
		}
		self.score++;
	}

	function take(){
		self.n_time -= OPTIONS.TAKE;
	}

	function reset(){
		self.n_time = OPTIONS.TIME;
		self.level = OPTIONS.LEVEL;
		self.score = OPTIONS.SCORE;
	}

	function clear(){
		for(let i in mosquitos){
			mosquitos[i].destroy();
		}
		mosquitos = {};
		clearInterval(i_time);
	}

	function remove(id){
		if(!mosquitos[id]) return;
		mosquitos[id].destroy();
		delete mosquitos[id];
	}

	function play(){
		status = 1;
		reset();
		playHandle();
	}

	function end(){
		status = 0;
		clear();
		endHandle({level, score});
	}

	function render(){
		clear();

		i_time = setInterval(function(){
			--self.n_time;
		}, 1000);

		// render mosquitos
		let {size, qualty, speed} = initLevel(level-1);
		for(let i = 0; i < qualty; i++){

			let _size = Math.round(Math.random()*size) + size/2;

			let mosquito = new AutoMoveObject([_size, _size], [], speed, function(e){
				mosquitoHandle(e, i);
			});

			mosquito.move();

			mosquitos[i] = mosquito;
		}
		mosquitosHandle(mosquitos);
	}

	function initLevel(i){
		let length = OPTIONS.MAX_LEVEL;
		let percen = (length - i)/length;
		let qualty = 2 + i * 0.6;
		let size = OPTIONS.SIZE * percen;
		let speed = [500 * percen, 1500 * percen];
		return {
			qualty,
			size,
			speed
		}
	}

	function getStatus(){
		return status;
	}

	function init(){

		Object.defineProperties(self, {
			level: {
				get: function(){ return level; },
				set: value=> {
					level = value;
					render();
					levelHandle({level, score});
				}
			},
			score: {
				get: function(){ return score; },
				set: value=> {
					score = value;
					levelHandle({level, score});
				}
			},
			n_time: {
				get: function(){ return n_time; },
				set: value=> {
					if(value <= 0){
						value = 0;
						end();
					}
					n_time = value;
					timeHandle(n_time);
				}
			}
		});

	}init();

	return {resize, play, getStatus, remove: click, take, end};

}