const objectKeyUpdater = (obj, keys) => {
	keys.forEach((whatakey) => {
		var index = whatakey.indexOf('_');
		var newKey = whatakey.replace('_', '');
		newKey = newKey.split('');
		newKey[index] = newKey[index].toUpperCase();
		newKey = newKey.join('');
		obj[newKey] = obj[whatakey];
		delete obj[whatakey];
	});
};

module.exports = {
	objectKeyUpdater,
};
