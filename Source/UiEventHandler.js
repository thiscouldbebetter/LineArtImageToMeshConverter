
class UiEventHandler
{
	static inputMapImageFile_OnChange(inputMapImageFile)
	{
		var fileUploaded = inputMapImageFile.files[0];
		var fileReader = new FileReader();
		fileReader.onload = (event) =>
		{
			var fileUploadedAsDataUrl = event.target.result;
			var imageUploaded = new Image(fileUploadedAsDataUrl);
			imageUploaded.initialize
			(
				UiEventHandler.imageUploaded_OnLoad
			);
		};
		fileReader.readAsDataURL(fileUploaded);
	}

	static imageUploaded_OnLoad(event)
	{
		var imageMap = this;

		var world = new World
		(
			imageMap,
			new Camera
			(
				new Coords(200, 200, 0), // viewSize
				100, // focalLength
				new Coords(100, 100, -100), // pos
				new Orientation
				(
					new Coords(0, 0, 1),
					new Coords(0, 1, 0)
				)
			)
		);

		Globals.Instance.initialize(world);
	}
}
