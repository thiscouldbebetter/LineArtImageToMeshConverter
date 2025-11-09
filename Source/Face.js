
class Face
{
	constructor(vertices)
	{
		this.vertices = vertices;
		this.bounds = new Bounds(new Coords(0, 0, 0), new Coords(0, 0, 0));

		this.plane = new Plane
		(
			new Coords(), 
			new Coords()
		).fromPoints
		(
			this.vertices[0],
			this.vertices[1],
			this.vertices[2]
		);

		this.edges = [];

		for (var i = 0; i < this.vertices.length; i++)
		{
			var iNext = i + 1;
			if (iNext >= this.vertices.length)
			{
				iNext = 0;
			}

			var vertexPos = this.vertices[i];
			var vertexPosNext = this.vertices[iNext];

			var edge = new Edge([vertexPos, vertexPosNext]);

			this.edges.push(edge);
		}

		this.bounds.setFromPositions(this.vertices);
	}

	recalculateDerivedValues()
	{
		this.plane.fromPoints
		(
			this.vertices[0].pos,
			this.vertices[1].pos,
			this.vertices[2].pos
		);

		for (var i = 0; i < this.edges.length; i++)
		{
			var edge = this.edges[i];

			edge.recalculateDerivedValues();
		}

		var vertexPositions = Vertex.addPositionsOfManyToList(this.vertices, []);
		this.bounds.setFromPositions(vertexPositions);
	}
}
