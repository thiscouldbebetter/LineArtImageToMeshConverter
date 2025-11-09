
class Transform_Orient
{
	constructor(orientation)
	{
		this.orientation = orientation;
	}

	applyToCoords(coordsToTransform)
	{
		return coordsToTransform.overwriteWithDimensions
		(
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform),
			this.orientation.forward.dotProduct(coordsToTransform)
		);
	}
}
