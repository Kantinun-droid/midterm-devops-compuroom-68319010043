// tests/computers.test.js
// ทดสอบ API หลักๆ ด้วย supertest
// ต้องมี PostgreSQL รันอยู่จริง (ตาม env vars ที่กำหนด) ก่อนรัน test นี้

const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');
const Computer = require('../models/Computer');

// รอให้เชื่อมต่อฐานข้อมูลและ sync ตารางเสร็จก่อนเริ่ม test
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // สร้างตารางใหม่สะอาดๆ สำหรับ test
});

// ปิดการเชื่อมต่อหลัง test เสร็จทั้งหมด
afterAll(async () => {
  await sequelize.close();
});

// ล้างข้อมูลก่อนแต่ละ test เพื่อไม่ให้ test ก่อนหน้ากระทบกัน
beforeEach(async () => {
  await Computer.destroy({ where: {}, truncate: true });
});

describe('GET /health', () => {
  it('ควรตอบสถานะ ok พร้อม version', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('version');
  });
});

describe('CRUD /api/computers', () => {
  it('POST ควรเพิ่มเครื่องใหม่สำเร็จ', async () => {
    const res = await request(app)
      .post('/api/computers')
      .send({
        asset_code: 'PC-001',
        brand_model: 'Dell OptiPlex 3080',
        cpu: 'Intel i5-10500',
        ram_gb: 8,
        room: 'ห้อง 501',
        status: 'ใช้งาน',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.asset_code).toBe('PC-001');
  });

  it('POST ควรล้มเหลวถ้าไม่ส่ง asset_code', async () => {
    const res = await request(app).post('/api/computers').send({
      brand_model: 'Dell OptiPlex 3080',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET ควรดึงรายการทั้งหมดได้', async () => {
    await Computer.create({ asset_code: 'PC-002', status: 'ใช้งาน' });

    const res = await request(app).get('/api/computers');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('GET /:id ควรดึงรายการเดียวได้ถูกต้อง', async () => {
    const computer = await Computer.create({ asset_code: 'PC-003', status: 'ใช้งาน' });

    const res = await request(app).get(`/api/computers/${computer.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.asset_code).toBe('PC-003');
  });

  it('GET /:id ควรตอบ 404 ถ้าไม่พบข้อมูล', async () => {
    const res = await request(app).get('/api/computers/99999');
    expect(res.statusCode).toBe(404);
  });

  it('PUT ควรแก้ไขข้อมูลได้ถูกต้อง', async () => {
    const computer = await Computer.create({ asset_code: 'PC-004', status: 'ใช้งาน' });

    const res = await request(app)
      .put(`/api/computers/${computer.id}`)
      .send({ status: 'ส่งซ่อม' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ส่งซ่อม');
  });

  it('DELETE ควรลบข้อมูลได้ถูกต้อง', async () => {
    const computer = await Computer.create({ asset_code: 'PC-005', status: 'ใช้งาน' });

    const res = await request(app).delete(`/api/computers/${computer.id}`);
    expect(res.statusCode).toBe(204);

    const check = await Computer.findByPk(computer.id);
    expect(check).toBeNull();
  });
});