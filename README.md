# shop-stock-cart

ระบบสินค้า + สต๊อก + ตะกร้าสินค้า — **.NET Core Web API (C#) + SQLite** ฝั่งหลังบ้าน และ **Next.js** ฝั่งหน้าบ้าน

```
shop-stock-cart/
├── backend/ShopApi/    .NET 10 Web API + EF Core + SQLite
└── frontend/           Next.js 16 (App Router)
```

---

## สิ่งที่ต้องมีก่อน

| | เวอร์ชัน | เช็คด้วย |
|---|---|---|
| .NET SDK | **10.0** ขึ้นไป | `dotnet --version` |
| Node.js | **20.9** ขึ้นไป | `node -v` |

> ไม่ต้องติดตั้ง SQLite แยก — EF Core มีมาให้ในตัว

---

## วิธีรัน

ต้องเปิด **2 terminal** รันพร้อมกัน

### 1. Backend

```bash
cd backend/ShopApi
dotnet run
```

เปิดที่ **http://localhost:5223**

- Swagger UI → http://localhost:5223/swagger
- ตัวอย่าง API → http://localhost:5223/api/products

> **ไม่ต้องรัน migration** — ไฟล์ `shop.db` ที่ seed ข้อมูลไว้แล้ว (สินค้า 15 รายการพร้อมสต๊อก) commit มากับ repo เรียบร้อย clone มาแล้วรันได้เลย

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิดที่ **http://localhost:3000**

> ต้องรัน Backend ก่อน ไม่งั้นหน้าเว็บจะขึ้นว่า *"โหลดรายการสินค้าไม่สำเร็จ ตรวจว่า Backend รันอยู่หรือยัง"*

