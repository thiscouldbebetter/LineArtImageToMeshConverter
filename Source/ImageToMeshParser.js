
class ImageToMeshParser
{
	constructor(colorToIgnore, colorForWall, wallHeight, depthMax)
	{
		this.colorToIgnore = colorToIgnore;
		this.colorForWall = colorForWall;
		this.wallHeight = wallHeight;
		this.depthMax = depthMax;
	}

	imageToMeshes(image)
	{
		var pointsOnWalls = this.imageToMeshes_1_ImageToPoints(image);

		var edgesForWalls = this.imageToMeshes_2_WallPointsToEdges(pointsOnWalls);

		edgesForWalls = this.imageToMeshes_3_EdgesMerge(edgesForWalls);

		edgesForWalls = this.imageToMeshes_4_EdgesCullDiagonalCorners(edgesForWalls);

		var edgeGroupsConnected = this.imageToMeshes_5_EdgesConnect(edgesForWalls);

		var meshesForWalls = this.imageToMeshes_6_EdgeGroupsToMeshes(edgeGroupsConnected);

		return meshesForWalls;
	}

	imageToMeshes_1_ImageToPoints(image)
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

				if (pixelColor.equals(this.colorToIgnore) == true)
				{
					// do nothing
				}
				else
				{
					var depth = 
						pixelColor.hue() 
						* this.depthMax;

					pointsOnWalls.push
					(
						pixelPos.clone().dimensionSet(2, depth)
					);
				}
			}
		}

		return pointsOnWalls;
	}

	imageToMeshes_2_WallPointsToEdges(pointsOnWalls)
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
				
				var distanceBetweenPointsXY = pointThis.clone().subtract
				(
					pointOther
				).dimensionSet
				(
					2, 0
				).magnitude();

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

					distancesToPointsClosestSoFar.splice
					(
						d, 0, distanceBetweenPointsXY
					);
					pointsClosestSoFar.splice
					(
						d, 0, pointOther
					);
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

	imageToMeshes_3_EdgesMerge(edgesForWalls)
	{
		var wereAnyEdgesMergedInPreviousRun = true;

		while (wereAnyEdgesMergedInPreviousRun == true)
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

	imageToMeshes_4_EdgesCullDiagonalCorners(edgesForWalls)
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

	imageToMeshes_5_EdgesConnect(edgesForWalls)
	{
		var edgeGroupsConnected = [];

		for (var i = 0; i < edgesForWalls.length; i++)
		{
			var edgeThis = edgesForWalls[i];
			var edgeThisAsGroup = [ edgeThis ];
			edgeGroupsConnected.push(edgeThisAsGroup);
		}

		var wereAnyGroupsMerged = true;

		while (wereAnyGroupsMerged == true)
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

							if (areEdgesConnectedXY == true)
							{
								areGroupsConnected = true;
								wereAnyGroupsMerged = true;
								break;
							}
						}
	
						if (areGroupsConnected == true)
						{
							break;
						}
					}
	
					if (areGroupsConnected == true)
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

	imageToMeshes_6_EdgeGroupsToMeshes(edgeGroupsConnected)
	{
		var returnValues = [];

		for (var g = 0; g < edgeGroupsConnected.length; g++)
		{
			var edgesInGroup = edgeGroupsConnected[g];

			var verticesMerged = [];
			var vertexIndicesForFaces = [];

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

			var numberOfCorners = verticesMerged.length;

			for (var v = 0; v < numberOfCorners; v++)
			{
				var vertex = verticesMerged[v];
				var vertexAbove = vertex.clone().dimensionSet
				(
					2, 0 - this.wallHeight
				);
				verticesMerged.push(vertexAbove);
			}

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

				vertexIndicesForFace.push
				(
					vertexIndicesForFace[1] + numberOfCorners
				);
				vertexIndicesForFace.push
				(
					vertexIndicesForFace[0] + numberOfCorners
				);

				vertexIndicesForFaces.push(vertexIndicesForFace);
			}

			var hueMax = 360;
			var hue = Math.floor(Math.random() * hueMax);
			var meshColor = "hsl(" + hue + ", 100%, 50%)";

			var mesh = new Mesh
			(
				"Mesh" + i,
				meshColor,
				verticesMerged,
				vertexIndicesForFaces
			);

			returnValues.push(mesh);
		}

		return returnValues;
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
		this.keyCodePressed = event.keyCode;
		Globals.Instance.world.update();
	}

	handleEventKeyUp(event)
	{
		this.keyCodePressed = null;
		Globals.Instance.world.update();
	}
}
