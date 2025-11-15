
class Coords
{
	constructor(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static fromXY(x, y)
	{
		return new Coords(x, y, 0);
	}

	static fromXYZ(x, y, z)
	{
		return new Coords(x, y, z);
	}

	static NumberOfDimensions = 3;

	add(other)
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	clone()
	{
		return new Coords(this.x, this.y, this.z);
	}

	crossProduct(other)
	{
		return this.overwriteWithDimensions
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	dimension(dimensionIndex)
	{
		var returnValue;

		if (dimensionIndex == 0)
		{
			returnValue = this.x;
		}
		else if (dimensionIndex == 1)
		{
			returnValue = this.y;
		}
		else
		{
			returnValue = this.z;
		}

		return returnValue;
	}

	dimensionSet(dimensionIndex, value)
	{
		if (dimensionIndex == 0)
		{
			this.x = value;
		}
		else if (dimensionIndex == 1)
		{
			this.y = value;
		}
		else
		{
			this.z = value;
		}

		return this;
	}

	divide(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;
		return this;
	}

	divideScalar(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	dotProduct(other)
	{
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	equals(other)
	{
		var returnValue = 
		(
			this.x == other.x
			&& this.y == other.y
			&& this.z == other.z
		);
		return returnValue;
	}

	equalsXY(other)
	{
		var returnValue = 
		(
			this.x == other.x
			&& this.y == other.y
		);
		return returnValue;
	}

	isInRangeMinMax(min, max)
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.y >= min.y
			&& this.z >= min.z
			&& this.x <= max.x
			&& this.y <= max.y
			&& this.z <= max.z
		);

		return returnValue;
	}

	isInRangeMax(max)
	{
		var returnValue =
		(
			this.x >= 0
			&& this.y >= 0
			&& this.z >= 0
			&& this.x <= max.x
			&& this.y <= max.y
			&& this.z <= max.z
		);

		return returnValue;
	}

	magnitude()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}


	magnitudeOrthogonal()
	{
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	multiply(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
		return this;
	}

	multiplyScalar(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	normalize()
	{
		return this.divideScalar(this.magnitude());
	}

	overwriteWith(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		return this;
	}

	overwriteWithDimensions(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	subtract(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

	// Serialization.

	static fromStringXxY(coordsAsString)
	{
		var xAndYAsStrings = coordsAsString.split("x");
		var xAndY = xAndYAsStrings.map(x => parseFloat(x) );
		var x = xAndY[0];
		var y = xAndY[1];
		var returnValue = Coords.fromXY(x, y);
		return returnValue;
	}

	static fromStringXxYxZ(coordsAsString)
	{
		var xyzAsStrings = coordsAsString.split("x");
		var xyz = xyzAsStrings.map(x => parseFloat(x) );
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var returnValue = Coords.fromXYZ(x, y, z);
		return returnValue;
	}

	toStringXxY()
	{
		var returnValue =
			+ this.x + "x" + this.y;

		return returnValue;
	}

	toStringXxYxZ()
	{
		var returnValue =
			+ this.x + "x"
			+ this.y + "x"
			+ this.z;

		return returnValue;
	}
}
