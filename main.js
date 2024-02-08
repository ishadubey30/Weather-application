 const API_KEY = "137d7f888186063e2802880671682c13"

 const DAYS_OF_THE_WEEK = ["Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat"]
let selectedCityText
let selectedCity
 const getCitiesUsingGeoLocation = async(searchtext) => {
   const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchtext}&limit=5&appid=${API_KEY}&units=metric`)
   return response.json()
 }

 const getCurrentWeatherData = async ({lat ,lon , name:city}) =>{
    const url = lat && lon? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
     const response = await fetch(url)
     return response.json()
}
 const getHourlyForecast =  async ( {name : city}) => {
   const response = await fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
   const data = await response.json()
   return data.list.map(forecast => {
    const {main : {temp , temp_max , temp_min} , dt , dt_txt , weather : [{description , icon }]} = forecast
    return {temp , temp_max , temp_min , dt , dt_txt,  description , icon }
   })
 }

 
 let createIconUrl = (icon) => ` https://openweathermap.org/img/wn/${icon}@2x.png `
 const FormatTemperature = (temp) => `${temp?.toFixed(1)}゜`

 

//temp_now kyuki temp_min we have already used and also it is for showing currenthourlystatus

 const loadHourlyForecast = ({main : {temp : tempNow}, weather : [{icon : iconNow}]} , hourlyForecast) => { 
    console.log(hourlyForecast)
    //we have something called time formatter we can use time formatter for change the 21:00:00
   const timeFormatter =  Intl.DateTimeFormat("en" , { hour12:true , hour:"numeric"})
    let dataForTwelveHours = hourlyForecast.slice(2,14) //12 entries
    const hourlyContainer = document.querySelector(".hourly-container")
    let innerHTMLString = 
    `
    <article>
        <h3 class="time">Now</h3>
        <img class="icon" src= "${createIconUrl(iconNow)}" /> 
        <p class="hourly-temp">${FormatTemperature(tempNow)}</p>
    </article>
    `
 // line number 47 me phele yeh tha phir we used time formatter <h2 class="time">${dt_txt.split(" ")[1]}</h2>


    for (let {temp , icon , dt_txt} of dataForTwelveHours){
        innerHTMLString += `<article>
        <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
        
        <img class="icon" src= "${createIconUrl(icon)}" /> 
        <p class="hourly-temp">${FormatTemperature(temp)}</p>
    </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString

 }


 const calculateDayWiseForecast = (hourlyforecast) => {
    let dayWiseForcast = new Map()
    for (let forecast of hourlyforecast){
        const [date] = forecast.dt_txt.split(" ")
        const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()] // getday is a function which tells that what
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
        let temp_min = Math.min(...Array.from(value , val => val.temp_min))
        let temp_max = Math.max(...Array.from(value , val => val.temp_max))


        dayWiseForcast.set(key , {temp_min , temp_max , icon : value.find( v => v.icon).icon})
    } 
    console.log(dayWiseForcast)
    return dayWiseForcast
 }

  const loadFiveDayForecast = (hourlyForecast) => {
     console.log(hourlyForecast) 
    const dayWiseForcast = calculateDayWiseForecast(hourlyForecast)    
     //we have multiple entries for a day eg 6pm 9pm so we have to group the entries together and use 
     //min and max temp of the entries . we will group the information date wise and for that we will use map.
    const container = document.querySelector(".five-day-forecast-container") 
     let dayWiseInfo = ""
     Array.from(dayWiseForcast).map(([day , {temp_max , temp_min , icon}], index) => {
         if (index < 5){
         dayWiseInfo += `<article class="day-wise-forecast">
         <h3 class="day">${index == 0 ? "Today" : day}</h3>
         <img class="icon" src = "${createIconUrl(icon)}" alt="">
         <p class="min-temp">${FormatTemperature(temp_min)}</p
         <p class="max-temp">${FormatTemperature(temp_max)}</p>
     </article> `
     }
       container.innerHTML = dayWiseInfo
     })
    }
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
 
    const loadhumidity = ({main : { humidity}}) =>{
     let container = document.querySelector("#humidity") 
     container.querySelector(".humid").textContent = ` ${humidity} % ` 
    }

// since we are typing each letter in search city box we are sending req to api every single time
// this is not very  performent so we will implement it by taking certain time and then once we done typing 
// with a delay it will give us the response
function debounce(func){
    let timer 
    return (...args) => {
        clearTimeout(timer) // clear existing timer
        // clear a new time till user is typing
        timer = setTimeout(() => {
            func.apply(this, args),   500
        })
    }
}

const loadForecastUSingGeolocation = () => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
        const {latitude : lat, longitude : lon} = coords
        selectedCity = {lat, lon}
        loadData()
    }, error => console.log(error))
}

const loadData = async () => {
    const currentWeather = await getCurrentWeatherData(selectedCity)
    loadCurrentForecast(currentWeather)
   const hourlyForecast = await getHourlyForecast(currentWeather)
     loadHourlyForecast(currentWeather , hourlyForecast)
     loadFiveDayForecast(hourlyForecast)
    loadfeelslike(currentWeather)
     loadhumidity(currentWeather)
}
    
 
const onSearchChange = async (event) => {
    let {value} = event.target
    if(!value ){
        selectedCity = null
        selectedCityText = ""
    }
    if(value && (selectedCityText !== value)){
    const listOfcities = await getCitiesUsingGeoLocation(value)
    console.log(listOfcities);
    let options = ""
    for ( let {lat, lon , name , state , country} of listOfcities){
        options += `<option data-city-details='${JSON.stringify({lat ,lon ,name})}' value="${name} , ${state} , ${country}"></option>`
    }
    document.querySelector("#cities").innerHTML = options
 
}
}
 
const debounceSearch = debounce((event) => onSearchChange(event)) 

const handleCitySelection = (event) => {
 selectedCityText = event.target.value
 let options = document.querySelectorAll("#cities > option")
 console.log(options)
 if (options?.length){
    let selectedOption = Array.from(options).find(opt => opt.value === selectedCityText)
    selectedCity = JSON.parse(selectedOption.getAttribute("data-city-details"))
   console.log({selectedCity});
    loadData()

 }

}

 document.addEventListener("DOMContentLoaded" , async () => {

    const searchinput = document.querySelector("#search")
    searchinput.addEventListener("input", debounceSearch)
    searchinput.addEventListener("change" , handleCitySelection)
    loadForecastUSingGeolocation()

 })

 