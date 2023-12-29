export default function Modal(class_name = 'modal'){
	let targets = document.getElementsByClassName(class_name);

	let self = {};
	
	let sto_auto_hide;

	function ModalItem(target){

		const CHAR_SLEEP = 100;

		let auto_hide = target.hasAttribute('auto-hide');
		let offset_close = target.hasAttribute('offset-close');
		let btn_close = target.hasAttribute('btn-close');

		let container = target.querySelector('.container') || target;

		function CloseItem(){
			let target = document.createElement('div');
			target.setAttribute('class','btn-close');
			target.innerHTML = 'x';
			return target;
		}

		function hide(){
			target.setAttribute('hide', true);
		}
		function show(e){
			clearTimeout(sto_auto_hide);
			target.removeAttribute('hide');
			if(e)
				container.innerHTML = e;
			if(auto_hide) closeByAuto();
		}

		function closeByOffset(){
			target.onclick = function(e){
				if(e.target == target)
					hide();
			}
		}
		function closeByAuto(){
			let n_time = target.getAttribute('auto-hide') || container.innerHTML.length * CHAR_SLEEP;
			sto_auto_hide = setTimeout(hide, n_time);
		}

		function closeByBtn(){
			let btn = new CloseItem;
			container.appendChild(btn);
			let child_container = document.createElement('div');
			container.appendChild(child_container);
			container = child_container;
			btn.onclick = hide;
		}

		function init(){
			if(offset_close) closeByOffset();
			if(btn_close) closeByBtn();

		}init();

		return {show, hide};
	}

	function init(){

		for(let i = 0; i < targets.length; i++){
			let target = targets[i]
			let item = ModalItem(target);
			let id = target.id;
			if(id);
			Object.defineProperty(self, id, {
				get: function(){ return item; }
			});
		}

	}init();

	return self;
}