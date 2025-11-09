
class Transform_TranslateInverse
{
	constructor(displacement)
	{
		this.displacement = displacement;
	}

	applyToCoords(coordsToTransform)
	{
		return coordsToTransform.subtract(this.displacement);
	}
}
