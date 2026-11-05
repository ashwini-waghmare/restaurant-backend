const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDb = require("./config/db");
const User = require("./models/User")

const app = express();

connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("welcome to Restauran backend");
});

app.post("/api/signup", async (req,res) => {
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const exitingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if(exitingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {
        console.error("signup error",error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
})

app.post("/api/login", async (req,res) => {
    try{
        const{username,password} = req.body;

        if(!username || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            })
        }

        const existingUser = await User.findOne({
            email: username.trim().toLowerCase() 
        });

        if(!existingUser){
            return res.status(401).json({
                message: "Invalid Username or password"
            })
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Invalid Username or password"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });

    }catch (error) {
        console.error("login error",error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

