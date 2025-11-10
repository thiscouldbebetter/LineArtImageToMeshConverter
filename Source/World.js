
class World
{
	constructor(camera, meshesForMap)
	{
		this.camera = camera;
		this.meshesForMap = meshesForMap;
	}

	update()
	{
		var inputHelper = Globals.Instance.inputHelper;
		var keyPressed = inputHelper.keyPressed;

		if (keyPressed != null)
		{
			var cameraPos = this.camera.pos;
			var cameraMoveAxes = new Orientation
			(
				new Coords(0, 0, 1),
				new Coords(0, 1, 0)
			);
			var cameraSpeed = 4;
			var cameraOffset = new Coords(0, 0, 0);

			if (keyPressed == "a")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.right)
					.multiplyScalar(0 - cameraSpeed);
			}
			else if (keyPressed == "d")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.right)
					.multiplyScalar(cameraSpeed);
			}
			else if (keyPressed == "f")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.forward)
					.multiplyScalar(cameraSpeed);
			}
			else if (keyPressed == "r")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.forward)
					.multiplyScalar(0 - cameraSpeed);
			}
			else if (keyPressed == "s")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.down)
					.multiplyScalar(cameraSpeed);
			}
			else if (keyPressed == "w")
			{
				cameraOffset
					.overwriteWith(cameraMoveAxes.down)
					.multiplyScalar(0 - cameraSpeed);
			}

			cameraPos.add(cameraOffset);
		}

		Globals.Instance.displayHelper.drawWorld(this);
	}
}
