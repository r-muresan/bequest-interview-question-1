
import request from 'supertest';
import app from '../index';
import { server } from '../app';

describe('Testes do Servidor', () => {
  afterAll(() => {
    server.close();
  });

  test("Health Check", async () => {
    return request(app)
      .get('/health')
      .expect(200)
  });

  test("Health Check", async () => {
    return request(app)
      .get('/health')
      .expect(200)
  });

  test("Add Block", async () => {
    return request(app)
      .post('/blockchain')
      .send({ data: 'block data' })
      .expect(201)
      .then(response => {
        console.log(response.text);
        expect(response.text).toBe('{"data":"block data"}');
      });
  });

  test("Get last block", async () => {
    return request(app)
      .get('/blockchain/last')
      .expect(200)
      .then(response => {
        console.log(response.text);
        expect(response.text).toBe('{"data":"block data"}');
      });
  }); 

  test("Validate chain", async () => {
    return request(app)
      .get('/blockchain/validate')
      .expect(200)
      .then(response => {
        console.log(response.text);
        expect(response.text).toBe('true');
      });
  });

  test("Get chain", async () => {
    return request(app)
      .get('/blockchain/chain')
      .expect(200)
      .then(response => {
        console.log(response.text);
        const chain = JSON.parse(response.text);
        expect(chain).toBeInstanceOf(Array);
        expect(chain.length).toBeGreaterThanOrEqual(2);
      });
  });

});
