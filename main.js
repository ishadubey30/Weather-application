 const API_KEY = "137d7f888186063e2802880671682c13"

 const DAYS_OF_THE_WEEK = ["sun" , "mon" , "tue" , "wed" , "thu" , "fri" , "sat"]

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

 const calculateDayWiseForecast = (hourlyForecast) => {
    let dayWiseForcast = new Map()
    for (let forecast of hourlyForecast){
        const [date] = forecast.dt_txt.split(" ")
        const dayOfTheWeek = DAYS_OF_THE_WEEK(new Date(date).getDay) // getday is a function which tells that what
        // is the day monday means 1 tuesday mean 2
        console.log(dayOfTheWeek)
        if (dayWiseForcast.has(dayOfTheWeek)){
            let forecastForTheDay = dayWiseForcast.get(dayOfTheWeek)
            forecastForTheDay.push(forecast);
            dayWiseForcast.set(dayOfTheWeek ,  forecastForTheDay)
        } else{
            dayWiseForcast.set(dayOfTheWeek , [forecast])    
        }
    }
    console.log(dayWiseForcast)
    for (let [key , value] of dayWiseForcast) {
        let minTemperature = Math.min(...Array.from(value , val => val.temp_min))
        let  maxTemperature = Math.max(...Array.from(value , val => val.temp_max))

        dayWiseForcast.set(key , {temp_min , temp_max , icon : value.find( v => v.icon)})
    } 
    console.log(dayWiseForcast)
 }

 const loadFiveDayForecast = (hourlyForecast) => {
    console.log(hourlyForecast)  //we have multiple entries for a day eg 6pm 9pm so we have to group the entries together and use 
    //min and max temp of the entries . we will group the information date wise and for that we will use map.

    const dayWiseForcast = calculateDayWiseForecast(hourlyForecast)
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



const loadfeelslike = ({main : {feels_like}}) =>{
    let container = document.querySelector("#feels-like") 
    container.querySelector(".feelslike-temp").textContent = FormatTemperature(feels_like)}
 
    const humidity = ({main : { humidity}}) =>{
     let container = document.querySelector("#humidity") 
     container.querySelector(".humid").textContent = ` ${humidity} % ` 
    }
 

 
 document.addEventListener("DOMContentLoaded" , async () => {
     const currentWeather = await getCurrentWeatherData()
     loadCurrentForecast(currentWeather)
    const hourlyForecast = await getHourlyData(currentWeather)
     loadHourlyForecast(hourlyForecast)
    loadfeelslike(currentWeather)
humidity(currentWeather)

 })

 