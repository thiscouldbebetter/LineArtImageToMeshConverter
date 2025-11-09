
class World
{
	constructor(imageForMap, camera)
	{
		this.imageForMap = imageForMap;
		this.camera = camera;
	}

	initialize()
	{
		var colorToIgnore = new Color([255, 255, 255, 255]);
		var colorForWall = new Color([0, 0, 0, 255]);
		var wallHeight = 10;
		var parser = new ImageToMeshParser
		(
			colorToIgnore,
			colorForWall, 
			wallHeight,
			10 // depthMax
		);
		this.meshesForMap = parser.imageToMeshes(this.imageForMap);
	}

	update()
	{
		var inputHelper = Globals.Instance.inputHelper;
		var keyCodePressed = inputHelper.keyCodePressed;

		if (keyCodePressed != null)
		{
			var cameraPos = this.camera.pos;
			var cameraMoveAxes = new Orientation
			(
				new Coords(0, 0, 1),
				new Coords(0, 1, 0)
			);
			var cameraSpeed = 4;

			if (keyCodePressed == 65) // a
			{
				cameraPos.add
				(
					cameraMoveAxes.right.clone().multiplyScalar
					(
						0 - cameraSpeed
					)
				);
			}
			else if (keyCodePressed == 68) // d
			{
				cameraPos.add
				(
					cameraMoveAxes.right.clone().multiplyScalar
					(
						cameraSpeed
					)
				);
			}
			else if (keyCodePressed == 70) // f
			{
				cameraPos.add
				(
					cameraMoveAxes.forward.clone().multiplyScalar
					(
						cameraSpeed
					)
				);
			}
			else if (keyCodePressed == 82) // r
			{
				cameraPos.add
				(
					cameraMoveAxes.forward.clone().multiplyScalar
					(
						0 - cameraSpeed
					)
				);
			}
			else if (keyCodePressed == 83) // s
			{
				cameraPos.add
				(
					cameraMoveAxes.down.clone().multiplyScalar
					(
						cameraSpeed
					)
				);
			}
			else if (keyCodePressed == 87) // w
			{
				cameraPos.add
				(
					cameraMoveAxes.down.clone().multiplyScalar
					(
						0 - cameraSpeed
					)
				);
			}
		}

		Globals.Instance.displayHelper.drawWorld(this);
	}
}
