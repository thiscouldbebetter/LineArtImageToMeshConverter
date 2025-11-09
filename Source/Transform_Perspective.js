
class Transform_Perspective
{
	constructor(focalLength)
	{
		this.focalLength = focalLength;
	}

	applyToCoords(coordsToTransform)
	{
		var distanceFromFocus = coordsToTransform.z;
		coordsToTransform.multiplyScalar
		(
			this.focalLength
		).divideScalar
		(
			distanceFromFocus
		);
		coordsToTransform.z = distanceFromFocus;

		return coordsToTransform;
	}
}
