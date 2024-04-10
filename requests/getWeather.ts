import Weather from "../models/Weather";
import secrets from "../secrets.json";

const getWeather = async (): Promise<Weather | undefined> => {
    const response = await fetch(secrets.apiEndpoint);
    if (response.ok) {
        const json = await response.json();
        if (json.status === 200) {
            return {
                temperature: json.data.current.temperature,
                weatherCode: json.data.current.weather_code,
                feelslike: json.data.current.feelslike,
                wind: json.data.current.wind_speed,
                humidity: json.data.current.humidity,
                pressure: json.data.current.pressure,
            }
        }
    }
}

export default getWeather;