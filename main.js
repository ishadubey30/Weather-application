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
    return {temp , temp_max , temp_min , dt , dt_txt, description ,icon }
   })
 }
// const 
 const loadHourlyForecast = (hourlyForecast) => { 
    console.log(hourlyForecast)
    let dataForTwelveHours = hourlyForecast.slice(1,13)
    const hourlyContainer = document.querySelector(".hourly-container")
    let innerHTMLString = ``
    for (let {temp , icon , dt_txt} of dataForTwelveHours){
        innerHTMLString += `<article>
        <h2 class="time">${dt_txt.split(" ")[1]}</h2>
        <img class="icon" src="${createIconUrl(icon)}" > 
        <p class="hourly-temp">${FormatTemperature(temp)}</p>
    </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString

 }


const loadfeelslike = ({main : {feels_like}}) =>{
   let container = document.querySelector("#feels-like") 
   container.querySelector(".feelslike-temp").textContent = FormatTemperature(feels_like)}

   const humidity = ({main : { humidity}}) =>{
    let container = document.querySelector("#humidity") 
    container.querySelector(".humid").textContent = ` ${humidity} % ` }

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
    const hourlyForecast = await getHourlyData(currentWeather)
     loadHourlyForecast(hourlyForecast)
    loadfeelslike(currentWeather)
humidity(currentWeather)

 })