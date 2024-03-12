import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";

const app = express();
const PORT = 8080;

const limiter = rateLimit({
	windowMs: 1000,
	limit: 50,
	message: "Received more than 50 requests per second",
	statusCode: 429,
});

app.use(express.json());
app.use(cors());
app.use(limiter);

app.post("/api", (req: Request, res: Response) => {
	const index = req.body.index;

	if (!index) {
		return res.status(400).json({ error: "No index provided" });
	}

	const delay = Math.floor(Math.random() * 1000) + 1;
	setTimeout(() => res.status(200).send({ index }), delay);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
