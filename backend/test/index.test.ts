import { expect } from 'chai';
import { describe, it } from 'mocha';
import supertest from 'supertest';
import {app} from '../src/index';

const staff1 = {
  staff_pass_id: "STAFF_AZ5HS58J5NA6",
  team_name: "SLYTHERIN",
  created_at: "1610793973888"
}

const staff2 = {
  staff_pass_id: "STAFF_8UEDJWLCYAIO",
  team_name: "SLYTHERIN",
  created_at: "1619686059106"
}

const invalidStaff = {
    staff_pass_id: "staff0",
    team_name: "invalidTeam",
    created_at: "1623817186943"
}

describe('API Tests', () => {
  it('Respond with a 200 status code for valid staff ID for /find/:staffId', (done) => {
    supertest(app)
      .get('/find/' + staff1.staff_pass_id) 
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Staff ID found and returned');
        expect(body.result).to.be.true;
        expect(body.data.staff_pass_id).to.equal(staff1.staff_pass_id);
        expect(body.data.team_name).to.equal(staff1.team_name);
        done();
      });
  });

  it('Respond with a 200 status code for invalid staff ID for /find/:staffId', (done) => {
    supertest(app)
      .get('/find/' + invalidStaff.staff_pass_id) 
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Staff ID not found');
        expect(body.result).to.be.false;
        done();
      });
  });

  it('Respond with a 200 status code for invalid staff ID for /redemption/create', (done) => {
    supertest(app)
      .post('/redemption/create') 
      .send({ 
        staff_pass_id: invalidStaff.staff_pass_id, 
        redeemed_at: 1617810395946
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Staff ID not found');
        expect(body.result).to.be.false;
        done();
      });
  });

  it('Respond with a 200 status code for successful redemption creation for /redemption/create', (done) => {
    supertest(app)
      .post('/redemption/create') 
      .send({ 
        staff_pass_id: staff1.staff_pass_id, 
        redeemed_at: 1617810395946
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Redemption created successfully');
        expect(body.result).to.be.true;
        expect(body.data.staff_pass_id).to.equal(staff1.staff_pass_id);
        expect(body.data.team_name).to.equal(staff1.team_name);
        done();
      });
  });

  it('Respond with a 200 status code for already redeemed by the same person for /redemption/create', (done) => {
    supertest(app)
      .post('/redemption/create') 
      .send({ 
        staff_pass_id: staff1.staff_pass_id, 
        redeemed_at: 1617810395946
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Already redeemed');
        expect(body.result).to.be.false;
        expect(body.data).to.not.be.empty;
        done();
      });
  });

  it('Respond with a 200 status code for already redeemed by different person for /redemption/create', (done) => {
    supertest(app)
      .post('/redemption/create') 
      .send({ 
        staff_pass_id: staff2.staff_pass_id, 
        redeemed_at: 1617810395946
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;
        expect(body.error).to.be.false;
        expect(body.message).to.equal('Already redeemed');
        expect(body.result).to.be.false;
        expect(body.data).to.not.be.empty;
        done();
      });
  });
});
