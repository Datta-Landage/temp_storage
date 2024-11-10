import {
	type ObjectCannedACL,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const app = express();

const s3Client = new S3Client({
	endpoint: "https://blr1.digitaloceanspaces.com",
	forcePathStyle: false,
	region: "BLR1",
	credentials: {
		accessKeyId: "DO00E2968MHNPADGYAXF",
		secretAccessKey: "zy7XZdbVpB5aZXEvzq9B333AkbVCn6713+K3eOngKBE",
	},
});

const uploadObject = async (file: any, fileName: string) => {
	const params = {
		Bucket: "t-static",
		Key: fileName, // Ensure the Key includes the full path within the bucket
		Body: file.buffer,
		ACL: "public-read" as ObjectCannedACL, // Ensure the ACL value is valid
		ContentType: file.mimetype, // Set the Content-Type based on file extension
		ContentDisposition: "inline", // Ensure the Content-Disposition is set to inline
	};

	try {
		const data = await s3Client.send(new PutObjectCommand(params));
		console.log(`Successfully uploaded object: ${params.Bucket}/${params.Key}`);
		return data;
	} catch (err) {
		console.error("Error uploading object:", err);
		throw err;
	}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(multer().any());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/upload", async (req, res) => {
	console.log("req.files", req.files);
	const files = req.files as
		| { [fieldname: string]: Express.Multer.File[] }
		| Express.Multer.File[];

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

	// Validate file type
	const validTypes = [
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/gif",
		"image/webp",
		"video/mp4",
	];
	if (!validTypes.includes(file.mimetype)) {
		return res.status(400).send("Invalid file type.");
	}

	// Validate file size (<= 5 MB)
	const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
	if (file?.size > maxSize) {
		return res.status(400).send("File size exceeds the 5 MB limit.");
	}
	const fileName = uuidv4() + file?.mimetype?.replace("image/", ".");
	try {
		const uploadImage = await uploadObject(file, fileName);
		if (!uploadImage) {
			return res.status(400).send("Error uploading file.");
		}
		const returnUrl = `https://t-static.blr1.digitaloceanspaces.com/${fileName}`;
		res.status(201).send({ url: returnUrl });
	} catch (err) {
		res.status(500).send("Error uploading file.");
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
