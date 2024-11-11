"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, multer_1.default)().any());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const sessionId = req.query.sessionId;
    if (!files) {
        return res.status(400).send("No file uploaded.");
    }
    let file;
    if (Array.isArray(files)) {
        file = files[0];
    }
    else {
        file = files[Object.keys(files)[0]][0];
    }
    console.log("file", file);
    const config = {
        url: `https://graph.facebook.com/v21.0/${sessionId}`,
        method: "POST",
        headers: {
            Authorization: "OAuth EAAQk2VVQJsEBOZBP8xHCHCZAvBWeAX1APC5E08Y0PCMCTGemp6OUsJrugkr6nNNYWnnrJcTL18GHoRzRBPuW2L0CGQvkK98djZBCxaAkUxKbH148EOMtYGxvj87NTqPz9TfoyjdVWMp5sKgZBI5tIdI4yvGBtyxsRCY5y81ZBvlYdLQNCaqQQP94ZC5llBP1EtJAZDZD",
            file_offset: 0,
            "Content-Type": "application/octet-stream",
        },
        data: file.buffer,
    };
    const uploadFile = yield (0, axios_1.default)(config);
    res.send(uploadFile.data);
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
