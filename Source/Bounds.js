
class Bounds
{
	constructor(min, max)
	{
		this.min = min;
		this.max = max;
	}

	containsPos(posToCheck)
	{
		return posToCheck.isInRangeMinMax(this.min, this.max);
	}

	overlapWith(bounds1)
	{
		var returnValue = false;

		var bounds = [ this, bounds1 ];

		for (var b = 0; b < bounds.length; b++)
		{
			var boundsThis = bounds[b];
			var boundsOther = bounds[1 - b];

			var doAllDimensionsOverlapSoFar = true;

			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				if 
				(
					boundsThis.max.dimension(d) < boundsOther.min.dimension(d)
					|| boundsThis.min.dimension(d) > boundsOther.max.dimension(d)
				)
				{
					doAllDimensionsOverlapSoFar = false;
					break;
				}
			}

			if (doAllDimensionsOverlapSoFar == true)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	}

	setFromPositions(positions)
	{
		this.min.overwriteWith(positions[0]);
		this.max.overwriteWith(positions[0]);

		for (var i = 1; i < positions.length; i++)
		{
			var pos = positions[i];

			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				var posDimension = pos.dimension(d);
				if (posDimension < this.min.dimension(d))
				{
					this.min.dimensionSet(d, posDimension);
				}
				if (posDimension > this.max.dimension(d))
				{
					this.max.dimensionSet(d, posDimension);
				}
			}
		}
	}
}
