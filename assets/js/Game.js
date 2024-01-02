import Mosquito from "./Mosquito.js";
import KonvaImage from "./KonvaImage.js";

function anmText(layer, x, y, text = '-5s', color = 'red'){
		let _text = new Konva.Text({
		    x,
		    y,
		    text,
		    fontSize: 30,
		    fontStyle: 'bold',
		    fontFamily: 'Calibri',
		    fill: color,
		});

		layer.add(_text);

		new Konva.Tween({
	        node: _text,
	        y: y - 44,
	        duration: .4,
	      }).play();

		setTimeout(function(){
			_text.destroy();
		}, 400);
}

export default function Game(nodes){

	nodes['A_0'].loop = 1;

	let e_level = document.getElementById('level');
	let e_score = document.getElementById('score');
	let e_time = document.getElementById('time');
	let e_options = document.getElementById('game-options');
	let e_play = document.getElementById('play');
	let e_sound = document.getElementById('o-sound');
	let e_effect = document.getElementById('o-effect');
	let e_level_h = document.getElementById('h_level');
	let e_score_h = document.getElementById('h_score');

	const L_KEY = 'height';
	const O_KEY = 'options';

	const height = localStorage[L_KEY] || "{}";
	const options = localStorage[O_KEY] || `{"sound":true,"effect":true}`;

	let {level, score} = JSON.parse(height);
	let {sound, effect} = JSON.parse(options);

	let count = 0;

	let e_click = 'mousedown';

	if(('ontouchstart' in document.documentElement))
		e_click = 'touchend';

	let bg_nodes = {};

	let app = new Mosquito(
		mosquitoHandle, mosquitoClickHandle, mosquitosHandle, timeHandle, levelHandle, playHandle, endHandle);

	let mosquitos = {};

	var stage = new Konva.Stage({
		container: 'game',
	});

	stage.on(e_click, e=>{

		if(!app.getStatus()) return;

		if(effect)
			nodes['A_1'].play();
		app.take();

		let {clientX, clientY} = e.evt;

		new anmText(layer, clientX - 15, clientY - 15);

	});

	var layer = new Konva.Layer();
    stage.add(layer);

    // resize
	function stageResize() {
		let width = window.innerWidth;
		let height = window.innerHeight;
		stage.width(width);
		stage.height(height);
		app.resize(width, height)

	    for(let i in bg_nodes)
	        bg_nodes[i].destroy();

		bg_nodes = drawBg(layer, nodes, width, height);

	}
	stageResize();
	window.addEventListener('resize', stageResize);

	function mosquitoHandle(e, id){
		let {position, deg} = e;
		let mosquito = mosquitos[id];
		if(mosquito){

			let _deg = (deg)%55;

			if(deg > -90 && deg < 90 && !mosquito.scaled){
				mosquito.scaled = 1;
				mosquito.scaleX(-1)
			}else if((deg < -90 || deg > 90) && mosquito.scaled){
				mosquito.scaled = 0;
				mosquito.scaleX(1);
			}

			mosquito.rotation(mosquito.scaled? _deg: -_deg);

			new Konva.Tween({
		        node: mosquito,
		        x: position[0],
		        y: position[1],
		        duration: .2,
		      }).play();

			let index = Math.round(Math.random()*count)+ 1;
			mosquito.zIndex(index);

		}
	}

	function mosquitoClickHandle(e){
		console.log(e);
	}

	function mosquitosHandle(e){

		let id = Math.round(Math.random()*4);
		document.body.style.background = `url(assets/imgs/bg${id}.png)`;

		count = Object.keys(e).length;

		for(let i in mosquitos){
			mosquitos[i].destroy();
		}

		for(let i in e){
			let {size, position} = e[i];
			let _image = new Konva.Image({
		          x: position[0],
		          y: position[1],
		          width: size[0],
		          height: size[1],
			      image: nodes['I_3']
			});
	  //   	_image.cache();
			// _image.drawHitFromCache();
	        layer.add(_image);
	        _image.on(e_click, function(){
	        	if(!app.getStatus())
	        		return;
	        	delete mosquitos[i];
	        	app.remove(i);
	        	_image.destroy();
	        	--count;

				if(effect)
					nodes['A_2'].play();

				let {x, y, width, height} = _image.attrs;

				new anmText(layer, x + width/2, y, '+1', 'yellow');
	        })
	        mosquitos[i] = _image;
		}
	}

	function timeHandle(e){
		let minus = Math.floor(e/60);
		let sec = e%60;
		e_time.innerHTML = `${minus}:${sec}`;
	}
	function levelHandle(e){
		let {level, score} = e;
		e_level.innerHTML = level;
		e_score.innerHTML = score;
	}
	function playHandle(e){
		if(sound)
			nodes['A_0'].play();
		e_options.style.display = 'none';
	}
	function endHandle(e){
		nodes['A_0'].pause();
		e_options.style.display = 'flex';
		let {level, score} = e;
		setHeight(level, score);
	}

	function setHeight(_level = 1, _score = 0){
		if(!level || _level > level)
			level = _level;
		if(!score || _score > score)
			score = _score;

		localStorage.setItem(L_KEY, JSON.stringify({level, score}));
		e_level_h.innerHTML = level;
		e_score_h.innerHTML = score;
	}

	function setOptions(_sound, _effect){
		if(_sound)
			e_sound.style.color = 'green';
		else
			e_sound.style.color = '';
		if(_effect)
			e_effect.style.color = 'green';
		else
			e_effect.style.color = '';
		sound = _sound;
		effect = _effect;
		localStorage.setItem(O_KEY, JSON.stringify({sound, effect}));
	}

	function init(){

		e_play.onclick = app.play;

		setHeight();
		setOptions(sound, effect);
		
		e_sound.onclick = function(){
			setOptions(!sound, effect)
		}

		e_effect.onclick = function(){
			setOptions(sound, !effect)
		}
	}init();

}

function drawBg(layer, nodes, width, height){

	let nuoc = {
		node: nodes['I_0'],
		width: width * .77,
		height: height * .55,
		zIndex: 0
	}

	let dua = {
		node: nodes['I_2'],
		width: height * .44,
		zIndex: 1
	}

	let co = {
		node: nodes['I_1'],
		height: height * .33,
		zIndex: 2
	}

	let co_nho = {
		node: nodes['I_5'],
		height: height * .22,
		zIndex: 3
	}

	let da = {
		node: nodes['I_6'],
		height: height * .22,
		zIndex: 4
	}

	return new KonvaImage(layer, [
		{
			...nuoc,
			x: width - nuoc.width * 1.2,
			y: height - nuoc.height,
		},
		{
			...dua,
			x: width - dua.width,
			y: 0,
		},
		{
			...co,
			x: -20,
        	y: height - co.height + 5,
		},
		{
			...co_nho,
			x: 20,
        	y: height - nuoc.height,
		},
		{
			...da,
			x: 20,
        	y: height - nuoc.height,
		}
	]).draws();

}