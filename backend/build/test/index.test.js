"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
const staff1 = {
    staff_pass_id: "STAFF_AZ5HS58J5NA6",
    team_name: "SLYTHERIN",
    created_at: "1610793973888"
};
const staff2 = {
    staff_pass_id: "STAFF_8UEDJWLCYAIO",
    team_name: "SLYTHERIN",
    created_at: "1619686059106"
};
const invalidStaff = {
    staff_pass_id: "staff0",
    team_name: "invalidTeam",
    created_at: "1623817186943"
};
(0, mocha_1.describe)('API Tests', () => {
    (0, mocha_1.it)('Respond with a 200 status code for valid staff ID for /find/:staffId', (done) => {
        (0, supertest_1.default)(index_1.app)
            .get('/find/' + staff1.staff_pass_id) // Replace with a valid staff ID
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Staff ID found and returned');
            (0, chai_1.expect)(body.result).to.be.true;
            (0, chai_1.expect)(body.data.staff_pass_id).to.equal(staff1.staff_pass_id);
            (0, chai_1.expect)(body.data.team_name).to.equal(staff1.team_name);
            // Add more assertions as needed
            done();
        });
    });
    (0, mocha_1.it)('Respond with a 200 status code for invalid staff ID for /find/:staffId', (done) => {
        (0, supertest_1.default)(index_1.app)
            .get('/find/' + invalidStaff.staff_pass_id) // Replace with an invalid staff ID
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Staff ID not found');
            (0, chai_1.expect)(body.result).to.be.false;
            // Add more assertions as needed
            done();
        });
    });
    (0, mocha_1.it)('Respond with a 200 status code for invalid staff ID for /redemption/create', (done) => {
        (0, supertest_1.default)(index_1.app)
            .post('/redemption/create') // Replace with a valid staff ID
            .send({
            staff_pass_id: invalidStaff.staff_pass_id,
            redeemed_at: 1617810395946
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Staff ID not found');
            (0, chai_1.expect)(body.result).to.be.false;
            // Add more assertions as needed
            done();
        });
    });
    (0, mocha_1.it)('Respond with a 200 status code for successful redemption creation for /redemption/create', (done) => {
        (0, supertest_1.default)(index_1.app)
            .post('/redemption/create') // Replace with a valid staff ID
            .send({
            staff_pass_id: staff1.staff_pass_id,
            redeemed_at: 1617810395946
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Redemption created successfully');
            (0, chai_1.expect)(body.result).to.be.true;
            (0, chai_1.expect)(body.result.data.staff_pass_id).to.equal(staff1.staff_pass_id);
            (0, chai_1.expect)(body.result.data.team_name).to.equal(staff1.team_name);
            // Add more assertions as needed
            done();
        });
    });
    (0, mocha_1.it)('Respond with a 200 status code for already redeemed by the same person for /redemption/create', (done) => {
        (0, supertest_1.default)(index_1.app)
            .post('/redemption/create') // Replace with a valid staff ID
            .send({
            staff_pass_id: staff1.staff_pass_id,
            redeemed_at: 1617810395946
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Already redeemed');
            (0, chai_1.expect)(body.result).to.be.false;
            (0, chai_1.expect)(body.data).to.not.be.empty;
            // Add more assertions as needed
            done();
        });
    });
    (0, mocha_1.it)('Respond with a 200 status code for already redeemed by different person for /redemption/create', (done) => {
        (0, supertest_1.default)(index_1.app)
            .post('/redemption/create') // Replace with a valid staff ID
            .send({
            staff_pass_id: staff2.staff_pass_id,
            redeemed_at: 1617810395946
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const body = res.body;
            (0, chai_1.expect)(body.error).to.be.false;
            (0, chai_1.expect)(body.message).to.equal('Already redeemed');
            (0, chai_1.expect)(body.result).to.be.false;
            (0, chai_1.expect)(body.data).to.not.be.empty;
            // Add more assertions as needed
            done();
        });
    });
});
