import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "./models/user.model.js";

dotenv.config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB connected.");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
connectDB();

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.post("/create-account", async (req, res) => {
	const { fullName, email, password } = req.body;

	if (!fullName || !email || !password) {
		return res.status(400).json({ error: true, message: "All fields are required." });
	}

	const isUser = await User.findOne({ email });
	if (isUser) {
		return res.status(400).json({ error: true, message: "User already exists." });
	}
});

app.listen(PORT, async () => {
	console.log(`Server is running on  http://localhost:${PORT}`);
});

export default app;
