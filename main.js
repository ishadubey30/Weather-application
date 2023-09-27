 const API_KEY = "137d7f888186063e2802880671682c13"
 const getCurrentWeatherData = async () =>{
     const city = "pune"
     const response = await 
     fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
     return response.json()
}
 const getHourlyData =  async ({name : city }) => {
   const reponse = await fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city},&appid=${API_KEY}`)
   const data = await reponse.json()
   return data.list.map(forecast => {
    const {main : {temp , temp_max , temp_min} , dt , dt_txt , weather : {description , icon }} = forecast
    return {temp , temp_max , temp_min , dt , dt_txt, icon }
   })
 }
// const 
 const loadHourlyForecast = (getHourlyData) => { 
    console.log(getHourlyData)
    let dataForTwelveHours = getHourlyData.slice(1,13)
    const hourlyContainer = document.querySelector(".hourly-container")
    let innerHTMLString = ``
    for (let {temp , icon , dt_txt} of dataForTwelveHours){
        innerHTMLString += `<article>
        <h2 class="time">${dt_txt.split(" ")[1]}</h2>
        <img class="icon" src="${createIconUrl(icon)}" alt="" /> 
        <p class="hourly-temp">${FormatTemperature(temp)}</p>
    </article>`
    }

 }

const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`
const FormatTemperature = (temp) => `${temp?.toFixed(1)}゜`


const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
    const currentForecastElement = document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = FormatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max-temp").textContent = `H : ${FormatTemperature(temp_max)} L: ${FormatTemperature(temp_min)}`;
};
 
 document.addEventListener("DOMContentLoaded" , async () => {
     const currentWeather = await getCurrentWeatherData()
     loadCurrentForecast(currentWeather)
     getHourlyData(currentWeather)
     loadHourlyForecast(getHourlyData)
    


 })

// const API_KEY = "137d7f888186063e2802880671682c13";

// const getCurrentWeatherData = async () => {
//     const city = "pune";
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.json();
//     } catch (error) {
//         console.error("Error fetching weather data:", error);
//     }
// }


// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const currentWeather = await getCurrentWeatherData();
//         if (currentWeather) {
//             loadCurrentForecast(currentWeather);
//         } else {
//             console.error("No weather data received.");
//         }
//     } catch (error) {
//         console.error("Error during initialization:", error);
//     }
// });
