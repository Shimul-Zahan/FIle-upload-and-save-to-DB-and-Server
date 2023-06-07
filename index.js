const express = require("express");
const app = express();
const multer = require("multer");
const mongoose = require("mongoose");

//middleware for data read
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create storage and filename for upload data to the server
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage }); //middleware for uploads image


//connect data base
const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/UploadFileToDB')
        console.log("hello shimul me the DB is created");
    } catch (error) {
        console.log(error);
    }
}

//create schema
const createSchema = new mongoose.Schema({
    firstName: String,
    secondName: String,
    id: String,
    dept: String,
    file: String
})

//create model
const students = mongoose.model("student", createSchema);


//get method
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

//post method
app.post("/registration", upload.single("file"), async(req, res) => { //upload is a middleware for uploading 
    try {
        const file = req.file.filename;
        const newstudent = new students({
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            id: req.body.id,
            dept: req.body.dept,
            file: req.file.filename
        });

        await newstudent.save(); //save DB
        res.status(200).send(newstudent);

    } catch (error) {
        res.send(error);
    }
})

app.get("/users", async(req, res) => {
    
    try {
        const searchUser = await students.find();

        if (searchUser) {
            res.send(searchUser);
        } else {
            res.send("There is no data here");
        }
    } catch (error) {
        res.send(error);
    }
})

//server running
app.listen(8080, async() => {
    console.log("server running at port 8080");
    await connectDB()
})