
class Plane
{
	constructor(normal, distanceFromOrigin)
	{
		this.normal = normal;
		this.distanceFromOrigin = distanceFromOrigin;
	}

	static DisplacementFromPoint0To1 = new Coords(0, 0, 0);

	equals(other)
	{
		var returnValue = 
		(
			this.normal.equals(other.normal) 
			&& this.distanceFromOrigin == other.distanceFromOrigin
		);

		return returnValue;
	}

	fromPoints(point0, point1, point2)
	{
		var displacementFromPoint0To1 = Plane.DisplacementFromPoint0To1;
		displacementFromPoint0To1.overwriteWith
		(
			point1
		).subtract
		(
			point0
		);

		var displacementFromPoint0To2 = point2.clone().subtract(point0);

		this.normal.overwriteWith
		(
			displacementFromPoint0To1
		).crossProduct
		(
			displacementFromPoint0To2
		).normalize();

		this.distanceFromOrigin = this.normal.dotProduct
		(
			point0
		);

		return this;
	}

}
