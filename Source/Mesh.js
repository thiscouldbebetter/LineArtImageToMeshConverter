
class Mesh
{
	constructor(name, color, vertices, vertexIndicesForFaces)
	{
		this.name = name;
		this.color = color;
		this.vertices = vertices;
		this.vertexIndicesForFaces = vertexIndicesForFaces;
	}

	static fromNameColorVerticesAndVertexIndicesForFaces
	(
		name, color, vertices, vertexIndicesForFaces
	)
	{
		return new Mesh(name, color, vertices, vertexIndicesForFaces);
	}

	face(faceIndex)
	{
		var verticesForFace = [];
		var vertexIndicesForFace = this.vertexIndicesForFaces[faceIndex];
		for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
		{
			var vertexIndex = vertexIndicesForFace[vi];
			var vertex = this.vertices[vertexIndex];
			verticesForFace.push(vertex);
		}

		var returnValue = new Face(verticesForFace);

		return returnValue;
	}

	// Serialization.

	static fromObjectDeserialized(meshAsObjectDeserialized)
	{
		var color = meshAsObjectDeserialized.color; // todo - Shouldn't just be string.

		var vertices =
			meshAsObjectDeserialized
				.vertices
				.map(x => Coords.fromStringXxYxZ(x) );

		var faces =
			meshAsObjectDeserialized
				.faces
				.map(x => x.split("-").map(y => parseInt(y) ) );

		var mesh = new Mesh
		(
			meshAsObjectDeserialized.name,
			color,
			vertices,
			faces
		);

		return mesh;
	}

	toObjectSerializable()
	{
		var thisAsObjectSerializable =
		{
			name: this.name,
			color: this.color, // Just a string, not actually a Color instance.
			vertices: this.vertices.map(x => x.toStringXxYxZ() ),
			faces: this.vertexIndicesForFaces.map(x => x.join("-") )
		};

		return thisAsObjectSerializable;
	}
}
