
class Transform_Camera
{
	constructor(camera)
	{
		this.camera = camera;

		this.transformTranslateInverse = new Transform_TranslateInverse(this.camera.pos);
		this.transformOrient = new Transform_Orient(this.camera.orientation);
		this.transformPerspective = new Transform_Perspective(this.camera.focalLength);
		this.transformTranslateCenter = new Transform_Translate(this.camera.viewSizeHalf);
	}

	applyToCoords(coordsToTransform)
	{
		this.transformTranslateInverse.applyToCoords(coordsToTransform);

		this.transformOrient.applyToCoords(coordsToTransform);

		this.transformPerspective.applyToCoords(coordsToTransform);

		this.transformTranslateCenter.applyToCoords(coordsToTransform);

		return coordsToTransform;
	}
}
