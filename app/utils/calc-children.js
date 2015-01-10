
var calcChildren = function(thing) {
	var total = 0;

	if (thing && thing.get('children')) {
		total += thing.get('children').length;

		for (var i = 0; i < thing.get('children').length; i++) {

			var childData = thing.get('children')[i].get('data');

			if (childData.replies) {
				total += calcChildren(childData.replies);
			}
		}
	}

	return total;
};

export default calcChildren ;