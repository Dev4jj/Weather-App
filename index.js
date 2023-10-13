import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const api_key = "def64655a738f89d1d2adb8a06f08ac4";
const geolocateApiUrl = `http://api.openweathermap.org/geo/1.0/direct?`;
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?`;

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/the-forecast", async (req, res) => {
    try {
        console.log(req.body);
        let cityname = req.body.city;
        const response = await axios.get(geolocateApiUrl + `q=${cityname}&appid=${api_key}`);
        const city_latitude = response.data[0].lat;
        const city_longitude = response.data[0].lon;
        const weather_response = await axios.get(weatherApiUrl + `lat=${city_latitude}&lon=${city_longitude}&appid=${api_key}&units=metric`);
        const weather = weather_response.data;
        console.log(weather);
        res.render("forecast.ejs", {
            weather_id: weather.weather[0].id,
            weather_description: weather.weather[0].description,
            current_temp: weather.main.temp,
            temp_max: weather.main.temp_max,
            temp_min: weather.main.temp_min,
            humidity: weather.main.humidity,
            wind_speed: (Math.floor(weather.wind.speed * 3.6)),
            wind_dir: weather.wind.deg,
            cloudcover: weather.clouds.all,
            city: weather.name,
            country: weather.sys.country,
        })
    } catch (error) {
console.log(error);
    }
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});