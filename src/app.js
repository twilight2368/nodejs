const express = require("express");
const app = express();
const Customer = require("./models/customer");
const Burger = require("./models/burger");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/customer", async (req, res) => {
  try {
    const result = await Customer.find();
    res.send({ people: result });
  } catch (error) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/customer/:id", async (req, res) => {
  console.log({
    resquestParams: req.params,
    requsetQuery: req.query,
  });

  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log({ customer });
    if (!customer) {
      res.status(404).json({ error: "Oops not found!" });
    } else {
      res.json({ customer });
    }
  } catch (error) {
    res.status(500).json({ error: "Oops!" });
  }
});

app.put("/api/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.replaceOne({ _id: customerId }, req.body);
    console.log(result);
    res.json({ updateCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: "Opps cant update" });
  }
});

app.delete("/api/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Opps cant delete" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user_info = req.body;
    const user = await Customer.login(user_info.name, user_info.password);

    if (user) {
      await console.log(user);
      const accessToken = await jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken: accessToken });
    }
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function authenticateToken(req, res, next) {
  const authenHeader = req.headers["authorization"];
  const token = authenHeader && authenHeader.split(" ")[1];
  if (token == null) {
    
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.get("/api/burger", authenticateToken, async (req, res) => {
  try {
    const result = await Burger.find();
    res.send({ burger: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/burger/:id", async (req, res) => {
  console.log({
    resquestParams: req.params,
    requsetQuery: req.query,
  });

  try {
    const { id: burgerId } = req.params;
    console.log(burgerId);
    const burger = await Burger.findById(burgerId);
    console.log({ burger });
    if (!burger) {
      res.status(404).json({ error: "Oops not found!" });
    } else {
      res.json({ burger });
    }
  } catch (error) {
    res.status(500).json({ error: "Oops!" });
  }
});

app.put("/api/burger/:id", async (req, res) => {
  try {
    const burgerId = req.params.id;
    const result = await Burger.replaceOne({ _id: burgerId }, req.body);
    console.log(result);
    res.json({ updateCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: "Opps cant update" });
  }
});

app.delete("/api/burger/:id", async (req, res) => {
  try {
    const burgerId = req.params.id;
    const result = await Burger.deleteOne({ _id: burgerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Opps cant delete" });
  }
});

app.post("/api/burger", async (req, res) => {
  console.log(req.body);
  const burger = new Burger(req.body);
  try {
    await burger.save();
    res.status(201).json({ burger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log("App listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
