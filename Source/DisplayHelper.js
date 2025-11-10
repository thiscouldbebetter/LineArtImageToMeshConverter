
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

		var newline = "\n";

		var edgeGroups = world.edgeGroupsConnectedForMap;
		var edgeGroupsAsStrings = [];
		for (var eg = 0; eg < edgeGroups.length; eg++)
		{
			var edgeGroup = edgeGroups[eg];

			var edgesAsStrings =
				edgeGroup.map(e => e.toStringVerticesFromToXY() );
			var edgesAsString =
				edgesAsStrings.join(newline);

			var edgeGroupAsString =
				"Edge Group " + eg + ":"
				+ newline
				+ edgesAsString;

			edgeGroupsAsStrings.push(edgeGroupAsString);
		}

		var blankLine = newline + newline;
		var edgeGroupsAsString = edgeGroupsAsStrings.join(blankLine);

		var d = document;

		var textareaEdges =
			d.getElementById("textareaEdges");
		textareaEdges.value = edgeGroupsAsString;

		var meshesForMap = world.meshesForMap;

		var meshesAsStrings =
			meshesForMap
				.map(x => x.toStringVertexPositionsAndFacesAsVertexIndexArrays() );
		var blankLine = newline + newline;
		var meshesAsString = meshesAsStrings.join(blankLine);

		var textareaMeshes =
			d.getElementById("textareaMeshes");
		textareaMeshes.value = meshesAsString;

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
