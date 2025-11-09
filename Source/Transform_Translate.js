
class Transform_Translate
{
	constructor(displacement)
	{
		this.displacement = displacement;
	}

	applyToCoords(coordsToTransform)
	{
		return coordsToTransform.add(this.displacement);
	}
}
