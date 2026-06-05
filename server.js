import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 فعلاً تستی (بعداً زرین‌پال می‌ذاریم)
const MERCHANT_ID = "TEST";

app.post("/pay", async (req, res) => {
  const amount = req.body.amount;

  console.log("Amount received:", amount);

  // فعلاً لینک تستی می‌سازیم
  res.json({
    url: "https://example.com/payment?amount=" + amount
  });
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});