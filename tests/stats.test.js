const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { ENV } = require('../src/common/enums/enums');

const {
	JWT: { SECRET },
} = ENV;

const { app } = require('../index');
const { expect } = chai;

console.log = () => {};

chai.use(chaiHttp);

describe('/stats route', () => {
	describe('GET /', async () => {
		it('should return server stats', async () => {
			const token = jwt.sign({ type: 'admin' }, SECRET);
			const { status, body } = await chai
				.request(app)
				.get(`/stats`)
				.set('authorization', `Bearer ${token}`);
			expect(status).to.be.equal(200);
			expect(body.totalUsers).to.be.equal(4);
			expect(body.totalBets).to.be.equal(2);
			expect(body.totalEvents).to.be.equal(2);
		});

		it("should return status 401 for not admin's token", async () => {
			const token = jwt.sign({ type: 'client' }, SECRET);
			const { status, body } = await chai
				.request(app)
				.get(`/stats`)
				.set('authorization', `Bearer ${token}`)
				.send();

			expect(status).to.be.equal(401);
			expect(body.error).to.be.equal('Not Authorized');
		});
	});
});
