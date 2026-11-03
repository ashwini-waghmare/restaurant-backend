const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./config/db");

const app = express();
connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("welcome to Restauran backend");
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

