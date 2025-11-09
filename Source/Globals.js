
class Globals
{
	static Instance = new Globals();

	initialize(world)
	{
		this.world = world;
		this.world.initialize();

		this.displayHelper = new DisplayHelper();
		this.displayHelper.initialize(this.world.camera.viewSize);
		this.displayHelper.drawWorld(this.world);

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();
	}
}
