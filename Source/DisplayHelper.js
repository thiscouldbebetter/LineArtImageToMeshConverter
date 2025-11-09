
class DisplayHelper
{
	clear()
	{
		var g = this.graphics;

		g.fillStyle = "White";
		g.fillRect
		(
			0, 0,
			this.viewSizeInPixels.x,
			this.viewSizeInPixels.y
		);

		g.strokeStyle = "LightGray";
		g.lineWidth = 1;
		g.lineJoin = null;
		g.strokeRect
		(
			0, 0,
			this.viewSizeInPixels.x,
			this.viewSizeInPixels.y
		);
	}

	drawImage(image, drawPosInPixels)
	{
		this.graphics.drawImage
		(
			image.systemImage,
			drawPosInPixels.x,
			drawPosInPixels.y
		);
	}

	drawMeshAbsolute(mesh)
	{
		this.graphics.strokeStyle = mesh.color;
		this.graphics.lineWidth = 8;
		this.graphics.lineJoin = "round";
		
		for (var f = 0; f < mesh.vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = mesh.vertexIndicesForFaces[f];

			this.graphics.beginPath();

			for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
			{
				var vertexIndex = vertexIndicesForFace[vi];
				var vertex = mesh.vertices[vertexIndex];

				if (vi == 0)
				{
					this.graphics.moveTo
					(
						vertex.x,
						vertex.y
					);
				}
				else
				{
					this.graphics.lineTo
					(
						vertex.x,
						vertex.y
					);
				}
			}

			this.graphics.closePath();
			this.graphics.stroke();
		}
	}

	drawMeshForCamera(mesh, camera)
	{
		this.graphics.strokeStyle = mesh.color;
		this.graphics.fillStyle = mesh.color;

		var drawPos = new Coords(0, 0, 0);
		this.graphics.beginPath();

		var vertexIndicesForFaces = mesh.vertexIndicesForFaces;
		for (var f = 0; f < vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = vertexIndicesForFaces[f];

			for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
			{
				var vertexIndex = vertexIndicesForFace[vi];
				var vertex = mesh.vertices[vertexIndex];

				drawPos.overwriteWith(vertex);
				camera.transformCamera.applyToCoords(drawPos);

				if (vi == 0)
				{
					this.graphics.moveTo(drawPos.x, drawPos.y);
				}
				else
				{
					this.graphics.lineTo(drawPos.x, drawPos.y);
				}

				if (this.isDebugModeActive == true)
				{
					this.graphics.fillText
					(
						vertex.toString(),
						drawPos.x, 
						drawPos.y
					);
				}
				
			}

			this.graphics.closePath();
			this.graphics.stroke();
		}
	}


	drawWorld(world)
	{
		this.clear();

		//this.drawImage(world.imageForMap, new Coords(0, 0));

		var meshesForMap = world.meshesForMap;
		for (var i = 0; i < meshesForMap.length; i++)
		{
			var mesh = meshesForMap[i];
			//this.drawMeshAbsolute(mesh);
			this.drawMeshForCamera(mesh, world.camera);
		}
	}

	initialize(viewSizeInPixels)
	{
		this.viewSizeInPixels = viewSizeInPixels;

		var d = document;

		var canvas = d.createElement("canvas");
		canvas.width = this.viewSizeInPixels.x;
		canvas.height = this.viewSizeInPixels.y;

		this.graphics = canvas.getContext("2d");

		var divOutput = d.getElementById("divOutput");
		divOutput.innerHTML = "";
		divOutput.appendChild(canvas);
	}
}
