// import standard deliverables
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});