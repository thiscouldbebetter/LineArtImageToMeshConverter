
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

	static fromStringHumanReadable(meshAsString)
	{
		var newline = "\n";
		var lines = meshAsString.split(newline);
		var name = lines[1].split(": ")[1];
		var color = lines[2].split(": ")[1];

		lines = lines.slice(4);
		var textFaces = "Faces:";
		var lineIndexForTextFaces = lines.indexOf(textFaces);
		var verticesAsStrings = lines.slice(0, lineIndexForTextFaces);
		var facesAsLines = lines.slice(lineIndexForTextFaces + 1);

		var vertices =
			verticesAsStrings.map(x => Coords.fromStringXYZ(x.split(": ")[1] ) );

		var vertexIndicesForFaces =
			facesAsLines.map
			(
				x => 
					x
						.split(": ")[1]
						.split(", ")
						.map(y => parseInt(y) )
			);

		var mesh = Mesh.fromNameColorVerticesAndVertexIndicesForFaces
		(
			name, color, vertices, vertexIndicesForFaces 
		);

		return mesh;
	}

	toStringHumanReadable()
	{
		var verticesAsStrings =
			this.vertices.map( (v, i) => i + ": " + v.toStringXYZ() )

		var newline = "\n";

		var verticesAsString = verticesAsStrings.join(newline);

		var facesAsVertexIndexStrings =
			this.vertexIndicesForFaces.map( (f, i) => i + ": " + f.join(", ") );

		var facesAsString = facesAsVertexIndexStrings.join(newline);

		var lines =
		[
			Mesh.name,
			"Name: " + this.name,
			"Color: " + this.color,
			"Vertices:",
			verticesAsString,
			"Faces:",
			facesAsString
		];

		var returnValue = lines.join(newline);
		return returnValue;
	}
}
