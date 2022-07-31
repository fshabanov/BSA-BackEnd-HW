const ee = require('events');

const statEmitter = new ee();

const emit = (event) => statEmitter.emit(event);

const onEmit = (event, callback) => statEmitter.on(event, callback);

const emitNewEvent = () => emit('newEvent');

const onNewEvent = (callback) => onEmit('newEvent', callback);

const emitNewUser = () => emit('newUser');

const onNewUser = (callback) => onEmit('newUser', callback);

const emitNewBet = () => emit('newBet');

const onNewBet = (callback) => onEmit('newBet', callback);

module.exports = {
	emitNewEvent,
	onNewEvent,
	emitNewUser,
	onNewUser,
	emitNewBet,
	onNewBet,
};
