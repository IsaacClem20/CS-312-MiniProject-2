// import standard deliverables
import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/check-uv", async (req, res) => {

    // Sets variables for the longitude and latitude being pulled
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    try {

        // forces the program to wait for the API to respond before moving on
        const response = await axios.get("https://api.openuv.io/api/v1/uv", {
            // converts long & lat into a URL for API to use
            params: {
                lat: latitude,
                lng: longitude
            },
            headers: {
                // keeps the API key fully anonomous 
                "x-access-token": process.env.OPENUV_API_KEY
            }
        });

        console.log(response.data);

        res.render("index.ejs", {
            uvData: response.data.result
        });

    } catch (error) {
        console.log(error.message);

        res.send("There was an error getting the UV data.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});