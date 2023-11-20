import chai from "chai";
import supertest from "supertest";
import { PORT } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);


describe('Testing de Carts - Backend - E-commerce', () => {
    it('Debe traer todos los carritos', async () => {
        try {
            const response = await requester.get("/api/carts").send();
            expect(response.status).to.equal(200);
        } catch (error) {
            throw error;
        }
    }) 
})