export default function Loader(urls = [], loaded = new Function){

	const LOADED_EVTS = {
		Image: 'onload',
		Audio: 'oncanplaythrough'
	};
	
	let	onstart = new Function
	
	let onload = new Function;

	let self = {load, onstart, onload, loaded};

	function load(_urls = urls, Model = Image, _loaded = loaded){

		let length = Object.keys(_urls).length;
		let result = {};
		let name = Model.name;
		let id = name[0] + '_';

		onstart(_urls, Model);

		for(let i in _urls){
			let url = _urls[i];

			if(typeof url == 'object'){
				load(url, window[i], function(items){
					Object.assign(result, items);
					if(--length == 0)
						loaded(result, self)
				});

				continue;
			}

			let item = new Model;
			item[LOADED_EVTS[name]] = function(){
				onload(item);
				if(--length == 0)
					_loaded(result, self)
			}
			item.src = url;
			result[id+i] = item;
		}

		return result;

	}

	function init(){

		Object.defineProperties(self, {
			load: { get: function(){ return load; } },
			onstart: { set: function(value){
				if(typeof value !== 'function')
					throw "value is not a function";
				onstart = value;
			} },
			onload: { set: function(value){
				if(typeof value !== 'function')
					throw "value is not a function";
				onload = value;
			} },
			loaded: { set: function(value){
				if(typeof value !== 'function')
					throw "value is not a function";
				loaded = value;
			} },
		});

	}init();

	return self;

}