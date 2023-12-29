import Modal from "./Modal.js";
import GameLoader from "./GameLoader.js";

(()=>{
	let modals = new Modal;
	new GameLoader(
		e=>{
			console.log('end loader', e);
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
})();