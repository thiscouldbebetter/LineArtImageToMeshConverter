
class Path
{
	constructor(vertices)
	{
		this.vertices = vertices;
	}

	static fromVertices(vertices)
	{
		return new Path(vertices);
	}

	static fromEdges(edges)
	{
		var edgesToPutInOrder = edges.map(x => x);
		var edgeCurrent = edgesToPutInOrder[0];
		edgesToPutInOrder.splice(0, 1);
		var edgesInOrder = [ edgeCurrent ];
		while (edgesToPutInOrder.length > 0)
		{
			var edgeCurrentVertices = edgeCurrent.vertices;
			var edgeCurrentVertexTo = edgeCurrentVertices[1];
			var edgeNext =
				edgesToPutInOrder
					.find
					(
						e => e.vertices.indexOf(edgeCurrentVertexTo) >= 0
					);
			var edgeNextVertices = edgeNext.vertices;
			var edgeNextVertexFrom = edgeNextVertices[0];
			var edgeNextNeedsReversing =
				(edgeNextVertexFrom != edgeCurrentVertexTo);
			if (edgeNextNeedsReversing)
			{
				edgeNext.verticesReverse();
			}
			var edgeNextIndex = edgesToPutInOrder.indexOf(edgeNext);
			edgesToPutInOrder.splice(edgeNextIndex, 1);
			edgeCurrent = edgeNext;
			edgesInOrder.push(edgeCurrent);
		}

		var verticesInOrder = edgesInOrder.map(x => x.vertices[0] );

		var path = Path.fromVertices(verticesInOrder);

		return path;
	}

	// Serialization.

	static fromStringJson(pathAsString)
	{
		var vertices = pathAsString.split("-").map(x => Coords.fromStringXxY(x) );
		return new Path(vertices);
	}

	toStringJson()
	{
		var returnValue =
			this.vertices.map(x => x.toStringXxY() ).join("-")
		return returnValue;
	}
}