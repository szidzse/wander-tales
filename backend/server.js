import express from "express";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.get("/hello", async (req, res) => {
	return res.status(200).json({ message: "hello" });
});

app.listen(PORT, () => {
	console.log(`Server is running on  http://localhost:${PORT}`);
});

export default app;
