
class Image
{
	constructor(source)
	{
		this.source = source;
	}

	colorOfPixelAtPos(pixelPos)
	{
		var imageDataForPixel = this.graphics.getImageData
		(
			pixelPos.x, pixelPos.y, 1, 1
		);
		var pixelComponentsAsUint8ClampedArray = imageDataForPixel.data;
		var pixelComponentsRGBA = 
		[
			pixelComponentsAsUint8ClampedArray[0],
			pixelComponentsAsUint8ClampedArray[1],
			pixelComponentsAsUint8ClampedArray[2],
			pixelComponentsAsUint8ClampedArray[3]
		];
		var returnValue = new Color(pixelComponentsRGBA);
		return returnValue;
	}

	initialize(callback)
	{
		this.systemImage = document.createElement("img");
		this.systemImage.src = this.source;
		this.systemImage.onload = this.initialize_2.bind(this, callback);
	}

	initialize_2(callback)
	{
		this.size = new Coords
		(
			this.systemImage.width,
			this.systemImage.height
		);

		var canvas = document.createElement("canvas");
		canvas.width = this.size.x;
		canvas.height = this.size.y;
		this.graphics = canvas.getContext("2d", { willReadFrequently: true } );
		this.graphics.drawImage(this.systemImage, 0, 0);

		callback.call(this);
	}
}

