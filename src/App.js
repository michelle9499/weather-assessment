import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import moment from 'moment'
import WeatherComponent from "./weather/weather.component";


const API_KEY = '67d2c5ba104bb5b7b7ef982bd0bde732'
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      main: undefined,
      description: '',
      tempMin: undefined,
      tempMax: undefined,
      humidity: undefined,
      time: '',
      icon: undefined,
      recent: [],
      error: false,
      errorMessage: ''
    };

    this.weatherIcon = {
      Thunderstorm: 'thunderstorm',
      Drizzle: 'sleet',
      Rain: 'storm-showers',
      Snow: 'snow',
      Atmosphere: 'fog',
      Clear: 'day-sunny',
      Clouds: 'day-fog'
    }
  }

  //calculate temperature in celcius
  calCelcius(temperature) {
    let cell = Math.floor(temperature - 273.15);
    return cell;
  }

  //get weather icon
  getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: null });
    }
  }

  //get current location
  getPosition = () => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  //get current weather with latitude and logitude
  getWeatherWithLatLon = async (latitude, logitude) => {
    const current_api_call = await fetch(`${WEATHER_URL}?lat=${latitude}&lon=${logitude}&appid=${API_KEY}`);
    const response = await current_api_call.json();

    this.setState({
      city: response.name,
      country: response.sys.country,
      main: response.weather[0].main,
      description: response.weather[0].description,
      tempMin: this.calCelcius(response.main.temp_min),
      tempMax: this.calCelcius(response.main.temp_max),
      humidity: response.main.humidity,
      time: moment(response.dt * 1000).format('YYYY-MM-DD h:mm a')
    })

    this.getWeatherIcon(this.weatherIcon, response.weather[0].id)
  }

  //get weather with city and country
  getWeather = async (e, rCity, rCountry) => {
    e.preventDefault();

    const city = rCity ? rCity : e.target.elements.city.value;
    const country = rCountry ? rCountry : e.target.elements.country.value;

    if (city && country) {
      const api_call = await fetch(`${WEATHER_URL}?q=${city},${country}&appid=${API_KEY}`);
      const response = await api_call.json();

      if (api_call.status === 404) {
        this.setState({ error: true, errorMessage: 'City or Country Not Found' });
      }

      this.setState({
        city: response.name,
        country: response.sys.country,
        main: response.weather[0].main,
        description: response.weather[0].description,
        tempMin: this.calCelcius(response.main.temp_min),
        tempMax: this.calCelcius(response.main.temp_max),
        humidity: response.main.humidity,
        time: moment(response.dt * 1000).format('YYYY-MM-DD h:mm a'),
        error: false
      },
        () => {
          this.addDataToRecent();
        });

      this.getWeatherIcon(this.weatherIcon, response.weather[0].id)
    } else {
      this.setState({ error: true, errorMessage: 'Please Enter City and Country' })
    }
  }

  //used localstorage for search history
  addDataToRecent = () => {
    let recent = this.state.recent;
    recent.push({
      city: this.state.city,
      country: this.state.country,
      time: moment().format('hh:mm:ss a')
    });

    this.setState({ recent }, () => {
      localStorage.setItem('recent', JSON.stringify(recent))
    });
  }

  //remove search history by index
  onRemoveHistory = (index) => {
    //remove from localstorage
    let recentData = JSON.parse(localStorage.getItem('recent'));
    recentData.splice(index, 1);
    localStorage.setItem('recent', JSON.stringify(recentData));

    //remove from ui
    const row = [...this.state.recent]
    row.splice(index, 1);
    this.setState({
      recent: row
    });
  }

  componentDidMount() {
    this.getPosition()
      .then((position) => {
        this.getWeatherWithLatLon(position.coords.latitude, position.coords.longitude);
      })
      .catch((err) => {
        this.setState({ error: true })
      });

    const data = localStorage.getItem('recent')

    this.setState({
      recent: JSON.parse(data)
    });
  }

  render() {
    return (
      <WeatherComponent
        loadWeather={this.getWeather}
        removeHistory={this.onRemoveHistory}
        error={this.state.error}
        errorMessage={this.state.errorMessage}
        city={this.state.city}
        country={this.state.country}
        main={this.state.main}
        description={this.state.description}
        tempMin={this.state.tempMin}
        tempMax={this.state.tempMax}
        humidity={this.state.humidity}
        time={this.state.time}
        icon={this.state.icon}
        recent={this.state.recent}
      />
    )
  }
}

export default App;