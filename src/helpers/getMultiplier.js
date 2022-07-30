const getMultiplier = (prediction, odds) => {
	switch (prediction) {
		case 'w1':
			return odds.homeWin;
		case 'w2':
			return odds.awayWin;
		case 'x':
			return odds.draw;
	}
};

module.exports = { getMultiplier };
