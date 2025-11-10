
class UiEventHandler
{
	static buttonMeshesRender_Clicked()
	{
		var d = document;
		var textareaMeshes =
			d.getElementById("textareaMeshes");
		var meshesAsString = textareaMeshes.value;
		var newline = "\n";
		var blankLine = newline + newline;
		var meshesAsStrings = meshesAsString.split(blankLine);
		var meshes =
			meshesAsStrings
				.map(x => Mesh.fromStringHumanReadable(x) );

		var camera = new Camera
		(
			Coords.fromXY(200, 200), // viewSize
			100, // focalLength
			Coords.fromXYZ(100, 100, -100), // pos
			new Orientation
			(
				Coords.fromXYZ(0, 0, 1),
				Coords.fromXYZ(0, 1, 0)
			)
		);

		var world = new World
		(
			camera, meshes
		);

		Globals.Instance.initialize(world);

		world.update();
	}

	static buttonPathsToMeshes_Clicked()
	{
		var d = document;
		var textareaPaths =
			d.getElementById("textareaPaths");
		var pathsAsString = textareaPaths.value;
		var newline = "\n";
		var blankLine = newline + newline;
		var pathsAsStrings = pathsAsString.split(blankLine);
		var paths = pathsAsStrings.map(x => Path.fromStringHumanReadable(x) );
		var imageToMeshParser = ImageToMeshParser.default();
		var meshes = imageToMeshParser.pathsConvertToMeshes(paths);
		var meshesAsStrings = meshes.map(x => x.toStringHumanReadable() );
		var meshesAsString = meshesAsStrings.join(blankLine);
		var textareaMeshes =
			d.getElementById("textareaMeshes");
		textareaMeshes.value = meshesAsString;
	}

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
		var imageToConvert = this;
		var imageToMeshParser = ImageToMeshParser.default();
		var paths = imageToMeshParser.imageConvertToPaths(imageToConvert);
		var pathsAsStrings = paths.map(x => x.toStringHumanReadable() );
		var newline = "\n";
		var blankLine = newline + newline;
		var pathsAsString = pathsAsStrings.join(blankLine);
		var d = document;
		var textareaPaths =
			d.getElementById("textareaPaths");
		textareaPaths.value = pathsAsString;
	}
}
