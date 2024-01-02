export default function KonvaImage(layer, images = [], is_png = true){

    let nodes = [];

    function draw(image){
    	let {x, y, width, height, zIndex, node} = image;
    	let _image = new Konva.Image({x, y, width, height, image: node});
        if(is_png){
            _image.cache();
            _image.drawHitFromCache();
        }
    	layer.add(_image);
        _image.zIndex(zIndex);

        return _image;
    }

    function draws(_images = images){

    	_images.forEach(image=>{
            nodes.push(draw(image));
        });

        return nodes;
    }

	return {draws, draw};

}