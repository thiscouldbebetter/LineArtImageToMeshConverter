
class Camera
{
	constructor(viewSize, focalLength, pos, orientation)
	{
		this.viewSize = viewSize;
		this.focalLength = focalLength;
		this.pos = pos;
		this.orientation = orientation;

		this.viewSizeHalf = this.viewSize.clone().divideScalar(2);
		this.transformCamera = new Transform_Camera(this);
	}
}
