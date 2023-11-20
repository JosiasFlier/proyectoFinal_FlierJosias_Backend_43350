import chai from "chai";
import supertest from "supertest";
import { fakerES_MX as faker } from '@faker-js/faker'
import { PORT } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);


describe('Testing de Products - Backend - E-commerce', () => {
    // Creo un producto de prueba con faker
    const testProduct = {
        _id: faker.database.mongodbObjectId(),
        title: faker.music.songName(),
        description: faker.lorem.paragraph(2),
        code: faker.string.alpha(10),
        status: true,
        price: parseFloat(faker.commerce.price({ min: 10000, max: 20000, dec: 0 })),
        stock: parseInt(faker.number.int({ min: 10, max: 30 })),
        category: faker.music.genre(),
        thumbnail: [faker.image.url()],
    };
    it('Debe crear un producto', async () => {
        try {
            const response = await requester.post("/api/products").send(testProduct);
            expect(response.status).to.equal(201);
        } catch (error) {
            throw error;
        }
    }) 
})