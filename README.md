ชื่อ: กันตินันท์ ทาแก้ว
รหัส: 68319010043

![CI](https://github.com/Kantinun-droid/midterm-devops-compuroom-68319010043/actions/workflows/ci.yml/badge.svg)

ระบบ CRUD สำหรับจัดการงาน สร้างด้วย Express.js + PostgreSQL + Vue 3

## Tech Stack
- **Backend:** Node.js + Express.js + PostgreSQL
- **Frontend:** Vue 3 + Vite
- **Container:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## วิธีรัน (Local)
```bash
# Clone
git clone https://github.com/Kantinun-droid/midterm-devops-compuroom-68319010043.git
cd taskboard

# รัน ด้วย Docker Compose
docker compose up --build
```
เข้า http://localhost เพื่อดู Frontend

## API Endpoints
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | /health | Health check |
| GET | /api/computers | ดึงงานทั้งหมด |
| POST | /api/computers | สร้างงานใหม่ |
| PUT | /api/computers/:id | แก้ไขงาน |
| DELETE | /api/computers/:id | ลบงาน |