
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

	toStringVertexPositionsAndFacesAsVertexIndexArrays()
	{
		var verticesAsStrings =
			this.vertices.map( (v, i) => i + ": " + v.toStringXYZ() )

		var newline = "\n";

		var verticesAsString = verticesAsStrings.join(newline);

		var facesAsVertexIndexStrings =
			this.vertexIndicesForFaces.map(f => f.join(", ") );

		var facesAsString = facesAsVertexIndexStrings.join(newline);

		var blankLine = newline + newline;

		var returnValue =
			"Mesh " + this.name + ":"
			+ newline
			+ "Color: " + this.color
			+ newline
			+ "Vertices:"
			+ newline
			+ verticesAsString
			+ newline
			+ "Faces:"
			+ newline
			+ facesAsString;

		return returnValue;
	}
}
