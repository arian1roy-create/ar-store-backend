const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const WALLET = "TCTvRJwQZEVtUz8Ai9ZjxRVjChzezs1DXN";

// ذخیره سفارش‌ها (موقت)
let orders = {};

// ساخت سفارش
app.post("/pay", (req, res) => {
  const amount = req.body.amount;

  if(!amount){
    return res.status(400).json({ error: "No amount" });
  }

  const orderId = "AR" + Date.now();

  orders[orderId] = {
    amount,
    paid: false
  };

  res.json({
    orderId,
    amount,
    wallet: WALLET
  });
});

// چک کردن وضعیت پرداخت
app.get("/check/:orderId", async (req, res) => {
  const order = orders[req.params.orderId];

  if(!order){
    return res.json({ error: "Order not found" });
  }

  try {
    // گرفتن تراکنش‌های ولت از TRON
    const response = await axios.get(
      `https://api.trongrid.io/v1/accounts/${WALLET}/transactions/trc20`
    );

    const txs = response.data.data || [];

    // چک ساده (بر اساس مقدار)
    const found = txs.find(tx =>
      Number(tx.value) / 1000000 >= order.amount &&
      tx.to === WALLET
    );

    if(found){
      order.paid = true;
    }

    res.json({
      paid: order.paid,
      orderId: req.params.orderId
    });

  } catch(err){
    res.json({ error: "Network error" });
  }
});

app.get("/", (req, res) => {
  res.send("AR Store Pro Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running"));
