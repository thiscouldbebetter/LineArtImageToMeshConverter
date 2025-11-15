
class Edge
{
	constructor(vertices)
	{
		this.vertices = vertices;
		this.displacement =
			this.vertices[1]
				.clone()
				.subtract(this.vertices[0] );
		this.length = this.displacement.magnitude();
		this.direction =
			this.displacement
				.clone()
				.divideScalar(this.length);
	}

	isConnectedToXY(other)
	{
		var returnValue = false;

		for (var i = 0; i < this.vertices.length; i++)
		{
			var vertexThis = this.vertices[i];

			for (var j = 0; j < other.vertices.length; j++)
			{
				var vertexOther = other.vertices[j];

				var verticesAreEqual =
					vertexThis.equalsXY(vertexOther);

				if (verticesAreEqual)
				{
					returnValue = true;
					break;
				}
			}
		}

		return returnValue;

	}

	mergeWith(other)
	{
		var returnValue = null; 

		var codirectionalityXY = Math.abs
		(
			this.direction.clone().dimensionSet(2, 0).normalize().dotProduct
			(
				other.direction.clone().dimensionSet(2,0).normalize()
			)
		);

		var codirectionalityThreshold = 1;

		if (codirectionalityXY >= codirectionalityThreshold)
		{
			for (var i = 0; i < this.vertices.length; i++)
			{
				var vertexThis = this.vertices[i];

				for (var j = 0; j < other.vertices.length; j++)
				{
					var vertexOther = other.vertices[j];

					var verticesAreEqual = vertexThis.equals
					(
						vertexOther
					);

					if (verticesAreEqual)
					{
						var vertexThisOuter = this.vertices[1 - i];
						var vertexOtherOuter = other.vertices[1 - j];

						if (vertexThis.z == 0)
						{
							returnValue = new Edge
							([
								vertexThisOuter,
								vertexOtherOuter
							]);
						}
						
						break;
					}
				}
			}
		}

		return returnValue;	
	}

	toStringVerticesFromToXY()
	{
		return this.vertices.map(x => x.toStringXxY() ).join("-");
	}

	verticesReverse()
	{
		this.vertices = this.vertices.reverse();
	}
}
