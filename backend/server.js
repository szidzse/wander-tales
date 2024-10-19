import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "./models/user.model.js";
import { authenticateToken } from "./utilities.js";

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

app.post("/signup", async (req, res) => {
	const { fullName, email, password } = req.body;

	if (!fullName || !email || !password) {
		return res.status(400).json({ error: true, message: "All fields are required." });
	}

	const isUser = await User.findOne({ email });
	if (isUser) {
		return res.status(400).json({ error: true, message: "User already exists." });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = new User({
		fullName,
		email,
		password: hashedPassword,
	});

	await user.save();

	const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "72h",
	});

	return res.status(201).json({
		error: false,
		user: { fullName: user.fullName, email: user.email },
		accessToken,
		message: "Registration successful.",
	});
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required." });
	}

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ message: "User not found." });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ message: "Invalid credentials." });
	}

	const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "72h",
	});

	return res.json({
		error: false,
		message: "Login successful.",
		user: {
			fullName: user.fullName,
			email: user.email,
		},
		accessToken,
	});
});

app.get("/get-user", authenticateToken, async (req, res) => {
	const { userId } = req.user;

	const isUser = await User.findOne({ _id: userId });

	if (!isUser) {
		return res.sendStatus(401);
	}

	return res.json({
		user: isUser,
		message: "",
	});
});

app.listen(PORT, async () => {
	console.log(`Server is running on  http://localhost:${PORT}`);
});

export default app;
