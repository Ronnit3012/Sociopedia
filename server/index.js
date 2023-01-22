import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';        // help in properly set the path when we configure the directories

/* CONFIGURATIONS  */
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({        // Multer GitHub repo
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});         // this is how you can save files anytime someone uploads a file on the website then the server will save the file at the destination('public/assets') mentioned with the filename
const upload = multer({ storage });

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Database is connected...')
    
    app.listen(PORT, () => {
        console.log(`Server Port: ${PORT}`);
    })
} catch (error) {
    console.log('Database not connected...')
}