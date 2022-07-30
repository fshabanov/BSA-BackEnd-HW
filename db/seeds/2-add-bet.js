exports.seed = (knex) => {
	return knex('bet').then(() => {
		return knex('bet').insert([
			{
				eventId: '154baa1f-2102-4874-a488-aa2713b9c2d3',
				betAmount: 100,
				prediction: 'w1',
				multiplier: 1.4,
				userId: '860329e2-ae5c-49f4-ba8b-38c49c6e1838',
			},
		]);
	});
};
