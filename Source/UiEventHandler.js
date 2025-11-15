
class UiEventHandler
{
	static buttonMeshesRender_Clicked()
	{
		var d = document;
		var textareaMeshes =
			d.getElementById("textareaMeshes");
		var meshesAsString = textareaMeshes.value;
		var meshesAsObjectDeserialized = JSON.parse(meshesAsString);
		var meshesAsObjectsDeserialized =
			meshesAsObjectDeserialized.meshes;
		var meshes =
			meshesAsObjectsDeserialized
				.map(x => Mesh.fromObjectDeserialized(x) );

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
		var pathsAsStringJson = textareaPaths.value;
		var pathsAsObjectDeserizlied = JSON.parse(pathsAsStringJson);
		var pathsAsStrings = pathsAsObjectDeserizlied.paths;
		var paths = pathsAsStrings.map(x => Path.fromStringJson(x) );

		var inputWallHeightInPixels =
			d.getElementById("inputWallHeightInPixels");
		var wallHeightInPixels = parseFloat(inputWallHeightInPixels.value);

		var imageToMeshParser =
			ImageToMeshParser.fromWallHeightInPixels(wallHeightInPixels);
		var meshes = imageToMeshParser.pathsConvertToMeshes(paths);

		var meshesAsObjectsSerializable = meshes.map(x => x.toObjectSerializable() );
		var meshesAsObjectSerializable =
		{
			meshes: meshesAsObjectsSerializable
		}
		var meshesAsString = JSON.stringify(meshesAsObjectSerializable, null, 4);
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
		var pathsAsStrings = paths.map(x => x.toStringJson() );
		var pathsAsObjectSerializable =
		{
			paths: pathsAsStrings
		};
		var pathsAsStringJson =
			JSON.stringify(pathsAsObjectSerializable, null, 4);
		var d = document;
		var textareaPaths =
			d.getElementById("textareaPaths");
		textareaPaths.value = pathsAsStringJson;

		var divImageUploaded = d.getElementById("divImageUploaded");
		divImageUploaded.innerHTML = "";
		divImageUploaded.appendChild(imageToConvert.systemImage);
	}
}
