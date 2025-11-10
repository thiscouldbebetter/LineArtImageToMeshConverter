
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
		var g = this.graphics;

		g.strokeStyle = mesh.color;
		g.lineWidth = 8;
		g.lineJoin = "round";

		var meshVertices = mesh.vertices;

		for (var f = 0; f < mesh.vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = mesh.vertexIndicesForFaces[f];

			var verticesForFace =
				vertexIndicesForFace.map(vi => meshVertices[vi]);

			g.beginPath();

			for (var v = 0; v < verticesForFace.length; v++)
			{
				var vertex = verticesForFace[v];

				if (v == 0)
				{
					g.moveTo
					(
						vertex.x,
						vertex.y
					);
				}
				else
				{
					g.lineTo
					(
						vertex.x,
						vertex.y
					);
				}
			}

			g.closePath();
			g.stroke();
		}
	}

	drawMeshForCamera(mesh, camera)
	{
		var g = this.graphics;

		g.strokeStyle = mesh.color;
		g.fillStyle = mesh.color;

		var drawPos = new Coords(0, 0, 0);
		g.beginPath();

		var meshVertices = mesh.vertices;
		var vertexIndicesForFaces = mesh.vertexIndicesForFaces;

		for (var f = 0; f < vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = vertexIndicesForFaces[f];
			var verticesForFace = vertexIndicesForFace.map(vi => meshVertices[vi] );

			for (var v = 0; v < verticesForFace.length; v++)
			{
				var vertex = verticesForFace[v];

				drawPos.overwriteWith(vertex);
				camera.transformCamera.applyToCoords(drawPos);

				if (v == 0)
				{
					g.moveTo(drawPos.x, drawPos.y);
				}
				else
				{
					g.lineTo(drawPos.x, drawPos.y);
				}

				if (this.isDebugModeActive)
				{
					g.fillText
					(
						vertex.toStringXY(),
						drawPos.x, 
						drawPos.y
					);
				}
				
			}

			g.closePath();
			g.stroke();
		}
	}

	drawWorld(world)
	{
		this.clear();

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

		var divMeshesRendered = d.getElementById("divMeshesRendered");
		divMeshesRendered.innerHTML = "";
		divMeshesRendered.appendChild(canvas);
	}
}
