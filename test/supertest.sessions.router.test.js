import chai from "chai";
import supertest from "supertest";
import { fakerES_MX as faker } from '@faker-js/faker'
import { PORT } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe('Testing de Sessions - Backend - E-commerce', () => {
    // Creo un usuario de prueba con faker
    const testUser = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 70 }),
        password: "secret",
    };
    it('Debe registrar un usuario', async () => {
        try {
            const response = await requester.post("/api/sessions/register").send(testUser);
            expect(response.status).to.equal(201);
        } catch (error) {
            throw error;
        }
    }) 
})
