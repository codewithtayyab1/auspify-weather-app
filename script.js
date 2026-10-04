const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temp = document.getElementById("temp");
const weatherDesc = document.getElementById("weatherDesc");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const errorMsg = document.getElementById("errorMsg");

// Weather code mapping to icon and description.
const weatherCodes = {
    0: { desc: "Clear Sky", icon: "fa-sun", color: "#fbbf24" },
    1: { desc: "Mainly Clear", icon: "fa-cloud-sun", color: "#fbbf24" },
    2: { desc: "Partly Cloudy", icon: "fa-cloud-sun", color: "#cbd5e1" },
    3: { desc: "Overcast", icon: "fa-cloud", color: "#94a3b8" },
    45: { desc: "Foggy", icon: "fa-smog", color: "#94a3b8" },
    61: { desc: "Slight Rain", icon: "fa-cloud-rain", color: "#38bdf8" },
    63: { desc: "Moderate Rain", icon: "fa-cloud-showers-heavy", color: "#0284c7" },
    95: { desc: "Thunderstorm", icon: "fa-bolt", color: "#f59e0b" },
};

// Fetch weather data using the free Open-Meteo API.
async function getWeather(city) {
    try {
        errorMsg.style.display = "none";

        // Get the coordinates for the city.
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorMsg.style.display = "block";
            return;
        }

        const location = geoData.results[0];
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();
        const current = weatherData.current_weather;

        // Update the UI.
        cityName.textContent = location.name;
        countryName.textContent = location.country || "Location";
        temp.textContent = `${Math.round(current.temperature)}°C`;
        windSpeed.textContent = `${current.windspeed} km/h`;

        const codeInfo = weatherCodes[current.weathercode] || {
            desc: "Sunny / Fair",
            icon: "fa-sun",
            color: "#fbbf24",
        };
        weatherDesc.textContent = codeInfo.desc;
        weatherIcon.className = `fa-solid ${codeInfo.icon}`;
        weatherIcon.style.color = codeInfo.color;
    } catch (error) {
        console.error("Error fetching weather:", error);
        errorMsg.style.display = "block";
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) getWeather(city);
    }
});

// Load a default city on startup.
getWeather("Karachi");
