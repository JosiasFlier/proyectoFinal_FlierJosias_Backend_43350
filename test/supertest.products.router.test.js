import chai from "chai";
import supertest from "supertest";
import { PORT } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);