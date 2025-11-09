
class Collision
{
	constructor(pos, distanceToCollision, colliders)
	{
		this.pos = pos;
		this.distanceToCollision = distanceToCollision;
		this.colliders = colliders;
	}

	static addCollisionsOfEdgeAndMeshToList(edge, mesh, listToAddTo)
	{
		for (var f = 0; f < mesh.faces.length; f++)
		{
			var face = mesh.faces[f];

			if (face.plane.normal.dotProduct(edge.direction) < 0)
			{
				var collision = this.findCollisionOfEdgeAndFace
				(
					edge,
					face
				);

				if (collision != null)
				{
					collision.colliders["Mesh"] = mesh;
					listToAddTo.push(collision);
				}
			}
		}

		return listToAddTo;
	}

	static findClosest(collisionsToCheck)
	{
		var collisionClosest = collisionsToCheck[0];
		
		for (var i = 1; i < collisionsToCheck.length; i++)
		{
			var collision = collisionsToCheck[i];
			if (collision.distanceToCollision < collisionClosest.distanceToCollision)
			{
				collisionClosest = collision;
			}
		}

		return collisionClosest;
	}

	static findCollisionOfEdgeAndFace(edge, face)
	{
		var returnValue = null;

		var collisionOfEdgeWithFacePlane = this.findCollisionOfEdgeAndPlane
		(
			edge,
			face.plane
		);

		if (collisionOfEdgeWithFacePlane != null)
		{
			var isWithinFace = this.isPosWithinFace
			(
				collisionOfEdgeWithFacePlane.pos, 
				face
			);

			if (isWithinFace == true)
			{
				returnValue = collisionOfEdgeWithFacePlane;
				returnValue.colliders["Face"] = face;
			}
		}

		return returnValue;
	}

	static findCollisionOfEdgeAndPlane(edge, plane)
	{
		var returnValue = null;

		var ray = new Ray(edge.vertices[0], edge.direction);

		var collisionOfRayAndPlane =
			this.findCollisionOfRayAndPlane(ray, plane);

		if 
		(
			collisionOfRayAndPlane != null 
			&& collisionOfRayAndPlane.distanceToCollision <= edge.length
		)
		{
			returnValue = collisionOfRayAndPlane;
			returnValue.colliders["Edge"] = edge;
		}

		return returnValue;
	}

	static findCollisionOfRayAndFace(ray, face)
	{
		var returnValue = null;

		var collisionOfRayAndPlane =
			this.findCollisionOfRayAndPlane(ray, face.plane);

		if 
		(
			collisionOfRayAndPlane != null 
			&& this.isPosWithinFace(collisionOfRayAndPlane.pos, face)
		)
		{
			returnValue = collisionOfRayAndPlane;
			returnValue.colliders["Face"] = face;
		}

		return returnValue;
	}

	static findCollisionOfRayAndPlane(ray, plane)
	{
		var returnValue = null;

		var distanceToCollision = 
			(
				plane.distanceFromOrigin 
				- plane.normal.dotProduct(ray.vertex)
			)
			/ plane.normal.dotProduct(ray.direction);

		if (distanceToCollision >= 0)
		{
			var collisionPos =
				ray.direction
					.clone()
					.multiplyScalar(distanceToCollision)
					.add(ray.vertex);

			var colliders = [];
			colliders["Ray"] = ray;
			colliders["Plane"] = plane;
	
			returnValue = new Collision
			(
				collisionPos,
				distanceToCollision,
				colliders
			);
		}

		return returnValue;
	}

	static isPosWithinFace(posToCheck, face)
	{
		var displacementFromVertex0ToCollision = new Coords();

		var isPosWithinAllEdgesOfFaceSoFar = true;
		var edgeFromFaceTransverse = new Coords();

		for (var e = 0; e < face.edges.length; e++)
		{
			var edgeFromFace = face.edges[e];
			edgeFromFaceTransverse
				.overwriteWith(edgeFromFace.direction)
				.crossProduct(face.plane.normal);

			displacementFromVertex0ToCollision
				.overwriteWith(posToCheck)
				.subtract(edgeFromFace.vertices[0]);

			var displacementProjectedAlongEdgeTransverse = 
				displacementFromVertex0ToCollision
					.dotProduct(edgeFromFaceTransverse);

			if (displacementProjectedAlongEdgeTransverse > 0)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

	static findDistanceOfPositionAbovePlane(posToCheck, plane)
	{
		var returnValue = posToCheck.dotProduct
		(
			plane.normal
		) - plane.distanceFromOrigin;

		return returnValue;
	}
}
