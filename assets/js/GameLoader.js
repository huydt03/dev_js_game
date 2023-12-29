import Loader from "./Loader.js";

export default function GameLoader(loaded = new Function, onstart = new Function, onload = new Function){

	const DIR = './assets/';

	const IMAGE_EX = '.png';

	const AUDIO_EX = '.mp3';

	const IMAGE_DIR = 'imgs/';

	const AUDIOS_DIR = 'audios/';

	const IMAGES = ['nuoc', 'co', 'dua', 'mosquito', 'x-icon'];

	const AUDIOS = ['bg', '0.1', '1.1'];

	let result = {};

	function init(){
		let images = {};
		for(let i in IMAGES){
			images[i] = DIR + IMAGE_DIR + IMAGES[i] + IMAGE_EX;
		}

		let audios = {};
		for(let i in AUDIOS){
			audios[i] = DIR + AUDIOS_DIR + AUDIOS[i] + AUDIO_EX;
		}

		let loader = new Loader({
			Image: images,
			Audio: audios
		}, loaded);

		loader.onstart = onstart;
		loader.onload = onload;

		loader.load();

	}init();

}