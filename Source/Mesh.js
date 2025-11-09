
class Mesh
{
	constructor(name, color, vertices, vertexIndicesForFaces)
	{
		this.name = name;
		this.color = color;
		this.vertices = vertices;
		this.vertexIndicesForFaces = vertexIndicesForFaces;
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
}
