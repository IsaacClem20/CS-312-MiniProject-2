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
    res.render("index.ejs", {
        uvData: null
    });
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

        const uv = response.data.result.uv;

        const maxUvTime = new Date(response.data.result.uv_max_time);

        // Just a format to make the time readable in the max UV time
        const formattedMaxUvTime = maxUvTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

        let uvRisk;

        if (uv <= 2) {
            uvRisk = "Low";
        } else if (uv <= 5) {
            uvRisk = "Moderate";
        } else if (uv <= 7) {
            uvRisk = "High";
        } else if (uv <= 10) {
            uvRisk = "Very High";
        } else {
            uvRisk = "Extreme";
        }


        let sunscreenMessage;

        if (uv >= 3) {
            sunscreenMessage = "Sunscreen is recommended.";
        } else if (uv >=8) {
            sunscreenMessage = "UV is insane! bettah wear sunscreen cuz!.";
        } else {
            sunscreenMessage = "Lower UV risk.";
        }

        // rendering the string variables to be displayed
        res.render("index.ejs", {
            uvData: response.data.result,
            uvRisk: uvRisk,
            sunscreenMessage: sunscreenMessage,
            formattedMaxUvTime: formattedMaxUvTime
        });

    } catch (error) {
        console.log(error.message);

        res.send("There was an error getting the UV data.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});