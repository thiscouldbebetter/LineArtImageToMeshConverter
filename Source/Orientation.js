
class Orientation
{
	constructor(forward, down)
	{
		this.forward = forward.clone().normalize();
		this.down = down.clone().normalize();
		this.right = this.down.clone().crossProduct(this.forward).normalize();
	}
}
