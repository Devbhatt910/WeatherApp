import sunny from '../assets/imgs/sunny.png'
import cloudy from '../assets/imgs/cloudy.png'
import rainy from '../assets/imgs/rainy.png'
import snow from '../assets/imgs/snowy.png'
import loader from '../assets/images/loading.gif'
import './WeatherApp.css'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faLocationDot, faMagnifyingGlassLocation, faTemperatureThreeQuarters, faWind } from '@fortawesome/free-solid-svg-icons'



const WeatherApp = () => {


          const [data,setData]=useState({})
          const [location,setLocation]=useState('')
          const [loading, setloading] = useState(false)
          const apikey="7ab5db93a3e23f8320fbbf6beb6238b1";



            useEffect(()=>{
              const fetchDefaultWeather= async ()=>{
                setloading(true)
                const defaultLocation="Gandhinagar"
                const url=`https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${apikey}`
                const res=await fetch(url);
                const defaultData = await res.json();
                setData(defaultData) 
                setloading(false)
                console.log(defaultData);
              }

              fetchDefaultWeather()
          },[])




            const handleInputChange=(e)=>{
                setLocation(e.target.value);

            }

            const search=async ()=>{
              if(location.trim() !== ""){
                const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${apikey}`
                const res=await fetch(url);
                const searchData=await res.json();
                if(searchData.cod !== 200){
                    setData({
                      notFound:true
                    })
                }else{
                  setData(searchData);
                  setLocation('')
                }
                setloading(false)
                // console.log(searchData);
                
              }
              
            }

            const handleKeyDown=(e)=>{
                if(e.key==="Enter"){
                  search()
                }
            }


            const weatherImages={
              Clear:sunny,
              Clouds:cloudy,
              Rain:rainy,
              Snow:snow,
              Mist:cloudy,
              Haze:cloudy,
              Smoke:cloudy,
              Fog:cloudy,
            }

            const weatherImg=data.weather ? weatherImages[data.weather[0].main] : null;


            const bgImages={
                Clear:'linear-gradient(to right , #f3b07c,#fcd284)',
                Clouds:'linear-gradient(to right , #57d6d4 , #71eeec)',
                Rain:'linear-gradient(to right , #5bc8fb , #80eaff)',
                Snow:'linear-gradient(to right , #aff2ff , #fff)',
                Haze:'linear-gradient(to right , #57d6d4 , #71eeec)',
                Mist:'linear-gradient(to right , #57d6d4 , #71eeec)',
                Smoke:'linear-gradient(to right , #57d6d4 , #71eeec)',
                Fog:'linear-gradient(to right , #57d6d4 , #71eeec)',
            }


            const bgImage= data.weather ? bgImages[data.weather[0].main] : 'linear-gradient(to right , #f3b07c,#fcd284)';
            console.log(bgImage);

            
            const temp=data.main ? `${Math.floor(data.main.temp)}` : null


            const currentDate = new Date();

            const daysOfWeek=["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thrusday" , "Friday" , "Saturday"]

            const months=["Jan" , "Feb" , "Mar" , "Apr" , "May" , "June" , "July" , "Aug" , "Sept" , "Oct" , "Nov" , "Dec"]
            
            const dayofWeek=daysOfWeek[currentDate.getDay()];
            const month=months[currentDate.getMonth()];
            const dayofMonth=currentDate.getDate();
            
            const formattedDates=`${dayofWeek} , ${dayofMonth} , ${month}`
            return (
            <div className="container" style={{ backgroundImage : bgImage }}>
                <div className="weather-app" style={{
                    backgroundImage  : bgImage && bgImage.replace ? bgImage.replace("to right" , "to top"): null
                }}>
                  <div className="search">
                    <div className="search-top">
                      {/* <i className="fa-solid fa-location-dot"></i> */}
                      <FontAwesomeIcon icon={faLocationDot} style={{
                        fontSize:"2rem"
                      }}/>
                      <div className="location">{data.name}</div>
                    </div>
                    <div className="search-bar">
                      <input type="text" placeholder="Enter Loaction" value={location} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                      {/* <button onClick={search} className='search-btn'>Search</button> */}
                      <FontAwesomeIcon icon={faMagnifyingGlassLocation} onClick={search} style={{
                        fontSize:"2.6rem",
                        paddingLeft:"10px",
                        paddingTop:"10px",
                        color:"#2f2e57"
                      }}/>
                    </div>
                  </div>
                  {loading ? (<img className='loader' src={loader} alt='Loading...'></img>) : data.notFound ? (<div className='not-found'>Not Found ☠️</div>) : (
                    <>

                            <div className="weather">
                                      <img src={weatherImg} style={{
                                        width:"900px",
                                        height:"500px"
                                      }}/>
                                      <div className="weather-type">{data.weather ? data.weather[0].main :null}</div>
                                      <div className="temp">{temp}°c</div>
                                    </div>
                                    <div className="weather-date">
                                      <p>{formattedDates}</p>
                                    </div>
                                    <div className="weather-data">
                                      <div className="humidity">
                                        <div className="data-name">Humidity</div>
                                        {/* <i className='fa-solid fa-droplet'></i> */}
                                        <FontAwesomeIcon icon={faDroplet} beat style={{
                                          fontSize:"2rem"
                                        }}/>
                                        <div className="data">{data.main ? data.main.humidity : null}%</div>
                                      </div>
                                      <div className="feelslike">
                                        <div className="data-name">Feels Like</div>
                                        {/* <i className='fa-solid fa-droplet'></i> */}
                                        {/* <FontAwesomeIcon icon={faTemperatureThreeQuarters} style={{color: "#f01c05",fontSize:"2rem"}} /> */}
                                        <FontAwesomeIcon icon={faTemperatureThreeQuarters} shake style={{color: "#fd0814",fontSize:"2rem"}} />
                                        <div className="data">{data.main ? data.main.feels_like : null}°c</div>
                                      </div>
                                      <div className="wind">
                                        <div className="data-name">Wind</div>
                                        {/* <i className='fa-solid fa-wind'></i> */}
                                        <FontAwesomeIcon icon={faWind} beatFade style={{color: "#0656e0",fontSize:"2rem"}} />
                                        <div className="data">{data.wind ? data.wind.speed : null}km/h</div>
                                      </div>
                                    </div>
                    </>
                  )}
                </div>
              </div>
            )
          }
          // document.querySelector('.container').style.backgroundImage = "url(`${backgroundImage}`)";

export default WeatherApp
