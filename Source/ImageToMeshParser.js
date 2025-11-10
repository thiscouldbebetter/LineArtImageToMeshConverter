
class ImageToMeshParser
{
	constructor(colorToIgnore, colorForWall, wallHeight, depthMax)
	{
		this.colorToIgnore = colorToIgnore;
		this.colorForWall = colorForWall;
		this.wallHeight = wallHeight;
		this.depthMax = depthMax;
	}

	colorRandomHsl()
	{
		var hueMax = 360;
		var hue = Math.floor(Math.random() * hueMax);
		var meshColor = "hsl(" + hue + ", 100%, 50%)";

		return meshColor;
	}

	edgeGroupsConnectedToMeshes(edgeGroupsConnected)
	{
		var returnValues = [];

		for (var g = 0; g < edgeGroupsConnected.length; g++)
		{
			var edgesInGroup = edgeGroupsConnected[g];

			var verticesMerged =
				this.edgeGroupsConnectedToMeshes_1_VerticesMerged(edgesInGroup);

			verticesMerged =
				this.edgeGroupsConnectedToMeshes_2_VertexAddAboveEachCorner(verticesMerged);

			var vertexIndicesForFaces =
				this.edgeGroupsConnectedToMeshes_3_VerticesToVertexIndicesForFaces
				(
					edgesInGroup, verticesMerged
				);

			var meshColor = this.colorRandomHsl();

			var mesh = Mesh.fromNameColorVerticesAndVertexIndicesForFaces
			(
				"Mesh" + g,
				meshColor,
				verticesMerged,
				vertexIndicesForFaces
			);

			returnValues.push(mesh);
		}

		return returnValues;
	}

	edgeGroupsConnectedToMeshes_1_VerticesMerged(edgesInGroup)
	{
		var verticesMerged = [];

		for (var e = 0; e < edgesInGroup.length; e++)
		{
			var edge = edgesInGroup[e];

			for (var i = 0; i < edge.vertices.length; i++)
			{
				var edgeVertex = edge.vertices[i];

				if (verticesMerged.indexOf(edgeVertex) == -1)
				{
					var hasEdgeVertexBeenMerged = false;

					for (var j = 0; j < verticesMerged.length; j++)
					{
						var vertexMerged = verticesMerged[j];
						if (vertexMerged.equals(edgeVertex) )
						{
							edge.vertices[i] = vertexMerged;
							hasEdgeVertexBeenMerged = true;
							break;
						}
					}

					if (hasEdgeVertexBeenMerged == false)
					{
						verticesMerged.push(edgeVertex);
					}
				}
			}
		}

		return verticesMerged
	}

	edgeGroupsConnectedToMeshes_2_VertexAddAboveEachCorner(verticesMerged)
	{
		var numberOfCorners = verticesMerged.length;

		for (var v = 0; v < numberOfCorners; v++)
		{
			var vertex = verticesMerged[v];
			var vertexAbove =
				vertex
					.clone()
					.dimensionSet(2, 0 - this.wallHeight);
			verticesMerged.push(vertexAbove);
		}

		return verticesMerged;
	}

	edgeGroupsConnectedToMeshes_3_VerticesToVertexIndicesForFaces
	(
		edgesInGroup, verticesMerged
	)
	{
		var numberOfCorners = verticesMerged.length / 2;

		var vertexIndicesForFaces = [];

		for (var e = 0; e < edgesInGroup.length; e++)
		{
			var edge = edgesInGroup[e];
			var edgeVertices = edge.vertices;

			var vertexIndicesForFace = 
			[
				verticesMerged.indexOf(edgeVertices[0]),
				verticesMerged.indexOf(edgeVertices[1]),
			];

			vertexIndicesForFace
				.push(vertexIndicesForFace[1] + numberOfCorners);
			vertexIndicesForFace
				.push(vertexIndicesForFace[0] + numberOfCorners);

			vertexIndicesForFaces.push(vertexIndicesForFace);
		}

		return vertexIndicesForFaces;
	}

	imageToEdgeGroupsConnected(image)
	{
		var pointsOnWalls =
			this.imageToEdgeGroupsConnected_1_ImageToPoints(image);

		var edgesForWalls =
			this.imageToEdgeGroupsConnected_2_WallPointsToEdges(pointsOnWalls);

		edgesForWalls =
			this.imageToEdgeGroupsConnected_3_EdgesMerge(edgesForWalls);

		edgesForWalls =
			this.imageToEdgeGroupsConnected_4_EdgesCullDiagonalCorners(edgesForWalls);

		var edgeGroupsConnected =
			this.imageToEdgeGroupsConnected_5_EdgesConnect(edgesForWalls);

		return edgeGroupsConnected;
	}

	imageToEdgeGroupsConnected_1_ImageToPoints(image)
	{
		var mapSize = image.size;

		var pointsOnWalls = [];

		var pixelPos = new Coords(0, 0, 0);

		for (var y = 0; y < mapSize.y; y++)
		{
			pixelPos.y = y;

			for (var x = 0; x < mapSize.x; x++)
			{
				pixelPos.x = x;

				var pixelColor = image.colorOfPixelAtPos(pixelPos);

				var pixelColorShouldBeIgnored =
					pixelColor.equals(this.colorToIgnore);

				if (pixelColorShouldBeIgnored)
				{
					// do nothing
				}
				else
				{
					var depth = 
						pixelColor.hue() 
						* this.depthMax;

					var pointOnWall = pixelPos.clone().dimensionSet(2, depth);

					pointsOnWalls.push(pointOnWall);
				}
			}
		}

		return pointsOnWalls;
	}

	imageToEdgeGroupsConnected_2_WallPointsToEdges(pointsOnWalls)
	{
		var edgesForWalls = [];

		var distanceThreshold = 2;

		for (var i = 0; i < pointsOnWalls.length; i++)
		{
			var pointThis = pointsOnWalls[i];

			var pointsClosestSoFar = [];
			var distancesToPointsClosestSoFar = [];

			for (var j = i + 1; j < pointsOnWalls.length; j++)
			{
				var pointOther = pointsOnWalls[j];
				
				var distanceBetweenPointsXY =
					pointThis
						.clone()
						.subtract(pointOther)
						.dimensionSet(2, 0)
						.magnitude();

				if (distanceBetweenPointsXY < distanceThreshold)
				{
					var d;
					for (d = 0; d < distancesToPointsClosestSoFar.length; d++)
					{
						var distance = distancesToPointsClosestSoFar[d];
						if (distanceBetweenPointsXY <= distance)
						{
							break;
						}
					}

					distancesToPointsClosestSoFar
						.splice(d, 0, distanceBetweenPointsXY);

					pointsClosestSoFar.splice(d, 0, pointOther);
				}
			}

			for (var d = 0; d < pointsClosestSoFar.length; d++)
			{
				var pointOther = pointsClosestSoFar[d];
				var edgeForPoints = new Edge
				([
					pointThis,
					pointOther
				]);
				edgesForWalls.push(edgeForPoints);
			}
		}

		return edgesForWalls;
	}

	imageToEdgeGroupsConnected_3_EdgesMerge(edgesForWalls)
	{
		var wereAnyEdgesMergedInPreviousRun = true;

		while (wereAnyEdgesMergedInPreviousRun)
		{
			wereAnyEdgesMergedInPreviousRun = false;

			var edgesForWallsNext = [];

			for (var i = 0; i < edgesForWalls.length; i++)
			{
				var edgeThis = edgesForWalls[i];

				var j;
				var edgeMerged = null;

				for (j = i + 1; j < edgesForWalls.length; j++)
				{
					var edgeOther = edgesForWalls[j];

					edgeMerged = edgeThis.mergeWith
					(
						edgeOther
					);

					if (edgeMerged != null)
					{
						break;
					}
				}

				if (edgeMerged != null)
				{
					edgesForWallsNext.push(edgeMerged);
					wereAnyEdgesMergedInPreviousRun = true;
					edgesForWalls.splice(j, 1);
				}
				else
				{
					edgesForWallsNext.push(edgeThis);
				}
			}

			edgesForWalls = edgesForWallsNext;
		}

		return edgesForWalls;
	}

	imageToEdgeGroupsConnected_4_EdgesCullDiagonalCorners(edgesForWalls)
	{
		var indicesOfEdgesToCull = [];

		for (var e = 0; e < edgesForWalls.length; e++)
		{
			var edgeForWall = edgesForWalls[e];

			var magnitudeOrthogonal = edgeForWall.displacement.magnitudeOrthogonal();

			if (magnitudeOrthogonal == 2)
			{
				indicesOfEdgesToCull.splice(0, 0, e);
			}
		}

		for (var i = 0; i < indicesOfEdgesToCull.length; i++)
		{
			var indexOfEdgeToCull = indicesOfEdgesToCull[i];
			edgesForWalls.splice(indexOfEdgeToCull, 1);
		}

		return edgesForWalls;
	}

	imageToEdgeGroupsConnected_5_EdgesConnect(edgesForWalls)
	{
		var edgeGroupsConnected = [];

		for (var i = 0; i < edgesForWalls.length; i++)
		{
			var edgeThis = edgesForWalls[i];
			var edgeThisAsGroup = [ edgeThis ];
			edgeGroupsConnected.push(edgeThisAsGroup);
		}

		var wereAnyGroupsMerged = true;

		while (wereAnyGroupsMerged)
		{
			wereAnyGroupsMerged = false;

			for (var g = 0; g < edgeGroupsConnected.length; g++)
			{
				var edgeGroupThis = edgeGroupsConnected[g];

				for (var h = g + 1; h < edgeGroupsConnected.length; h++)
				{
					var edgeGroupOther = edgeGroupsConnected[h];

					var areGroupsConnected = false;

					for (var i = 0; i < edgeGroupThis.length; i++)
					{
						var edgeThis = edgeGroupThis[i];
						
						for (var j = 0; j < edgeGroupOther.length; j++)
						{
							var edgeOther = edgeGroupOther[j];
							var areEdgesConnectedXY = edgeThis.isConnectedToXY
							(
								edgeOther
							);

							if (areEdgesConnectedXY)
							{
								areGroupsConnected = true;
								wereAnyGroupsMerged = true;
								break;
							}
						}

						if (areGroupsConnected)
						{
							break;
						}
					}

					if (areGroupsConnected)
					{
						for (var k = 0; k < edgeGroupOther.length; k++)
						{
							var edgeToAppend = edgeGroupOther[k];
							edgeGroupThis.push(edgeToAppend);
						}
						edgeGroupsConnected.splice(h, 1);
						break;
					}
				}
			}
		}

		return edgeGroupsConnected;
	}
}

class InputHelper
{
	initialize()
	{
		var d = document;
		d.body.onkeydown = this.handleEventKeyDown.bind(this);
		d.body.onkeyup = this.handleEventKeyUp.bind(this);
	}

	// events

	handleEventKeyDown(event)
	{
		this.keyPressed = event.key;
		Globals.Instance.world.update();
	}

	handleEventKeyUp(event)
	{
		this.keyPressed = null;
		Globals.Instance.world.update();
	}
}
