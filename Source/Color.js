
class Color
{
	constructor(componentsRGBA)
	{
		this.componentsRGBA = componentsRGBA;

		this.systemColor = 
			"rgba(" 
			+ this.componentsRGBA[0] + "," 
			+ this.componentsRGBA[1] + ","
			+ this.componentsRGBA[2] + ","
			+ (this.componentsRGBA[3] / 255)
			+ ")";
	}

	equals(other)
	{
		var returnValue = true;

		for (var i = 0; i < this.componentsRGBA.length; i++)
		{
			var componentThis = this.componentsRGBA[i];
			var componentOther = other.componentsRGBA[i];

			if (componentThis != componentOther)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	hue()
	{
		// This may not calculate correctly.

		var returnValue = null;

		var red = this.componentsRGBA[0];
		var green = this.componentsRGBA[1];
		var blue = this.componentsRGBA[2];

		var hue = null;
		var saturation = null;
		var value = null;

		var rgbComponentMin = red;
		if (rgbComponentMin > green)
		{
			rgbComponentMin = green;
		}
		if (rgbComponentMin > blue)
		{
			rgbComponentMin = blue;
		}

		var rgbComponentMax = red;
		if (rgbComponentMax < green)
		{
			rgbComponentMax = green;
		}
		if (rgbComponentMax < blue)
		{
			rgbComponentMax = blue;
		}

		var rgbComponentRange = rgbComponentMax - rgbComponentMin;

		value = rgbComponentMax;

		if (rgbComponentRange == 0)
		{
			hue = 0;
		   	saturation = 0;
		}
		else
		{
			if (rgbComponentMax == red)
			{
				hue = Math.abs(green - blue) / rgbComponentRange;
			}
			else if (rgbComponentMax == green)
			{
				hue = Math.abs(blue - red) / rgbComponentRange + (1 / 3);
			}
			else if (rgbComponentMax == blue)
			{
				hue = Math.abs(red - green) / rgbComponentRange + (2 / 3);
			}

			saturation = rgbComponentRange / value;
		}

		return hue;
	}

	luminance()
	{
		var returnValue = Math.floor
		(
			(
				this.componentsRGBA[0]
				+ this.componentsRGBA[1]
				+ this.componentsRGBA[2]
			) 
			/ 3
		);

		return returnValue;
	}
}
