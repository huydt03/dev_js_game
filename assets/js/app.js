import Modal from "./Modal.js";
import GameLoader from "./GameLoader.js";
import Game from "./Game.js";
	

window.onload = ()=>{
	
	let modals = new Modal;

	new GameLoader(
		(nodes)=>{
			console.log('end loader');
			new Game(nodes);
			modals['loading'].hide();
		},
		e=>{
			console.log('start loader');
			modals['loading'].show();
		},
		e=>{
			console.log('loader item', e);
		}
	);

};