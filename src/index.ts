import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import multer from "multer";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(multer().any());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/upload", async (req, res) => {
	const files = req.files as
		| { [fieldname: string]: Express.Multer.File[] }
		| Express.Multer.File[];
	const sessionId = req.query.sessionId;
	if (!files) {
		return res.status(400).send("No file uploaded.");
	}

	let file: Express.Multer.File;
	if (Array.isArray(files)) {
		file = files[0];
	} else {
		file = files[Object.keys(files)[0]][0];
	}

	console.log("file", file);

	const config = {
		url: `https://graph.facebook.com/v21.0/${sessionId}`,
		method: "POST",
		headers: {
			Authorization:
				"OAuth EAAQk2VVQJsEBOZBP8xHCHCZAvBWeAX1APC5E08Y0PCMCTGemp6OUsJrugkr6nNNYWnnrJcTL18GHoRzRBPuW2L0CGQvkK98djZBCxaAkUxKbH148EOMtYGxvj87NTqPz9TfoyjdVWMp5sKgZBI5tIdI4yvGBtyxsRCY5y81ZBvlYdLQNCaqQQP94ZC5llBP1EtJAZDZD",
			file_offset: 0,
			"Content-Type": "application/octet-stream",
		},
		data: file.buffer,
	};
	const uploadFile = await axios(config);
	res.send(uploadFile.data);
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
