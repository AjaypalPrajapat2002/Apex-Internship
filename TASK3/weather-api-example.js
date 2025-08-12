// Example: Real Weather API Integration
// This file shows how to replace the mock API with a real OpenWeatherMap API

class RealWeatherAPI {
  constructor() {
    // Get your free API key from: https://openweathermap.org/api
    this.apiKey = 'YOUR_ACTUAL_API_KEY_HERE';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeatherData(city) {
    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data. Please check the city name and try again.');
    }
  }

  formatWeatherData(data) {
    return {
      name: data.name,
      country: data.sys.country,
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure
      },
      weather: [
        {
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          main: data.weather[0].main
        }
      ],
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg
      },
      visibility: data.visibility,
      clouds: data.clouds.all,
      dt: data.dt,
      timezone: data.timezone
    };
  }
}

// Usage example:
/*
const weatherAPI = new RealWeatherAPI();

// Replace the fetchWeatherData method in WeatherApp class with:
async fetchWeatherData(city) {
  const weatherAPI = new RealWeatherAPI();
  return await weatherAPI.getWeatherData(city);
}
*/

// Alternative: Using a different free weather API (OpenMeteo)
class OpenMeteoAPI {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  async getWeatherData(city) {
    try {
      // First, get coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      
      if (!geoResponse.ok) {
        throw new Error('City not found');
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }
      
      const { latitude, longitude } = geoData.results[0];
      
      // Get weather data for the coordinates
      const weatherResponse = await fetch(
        `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Weather data not available');
      }
      
      const weatherData = await weatherResponse.json();
      return this.formatWeatherData(weatherData, geoData.results[0]);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  formatWeatherData(data, location) {
    const current = data.current;
    
    return {
      name: location.name,
      country: location.country,
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: 1013 // OpenMeteo doesn't provide pressure in free tier
      },
      weather: [
        {
          description: this.getWeatherDescription(current.weather_code),
          icon: this.getWeatherIcon(current.weather_code),
          main: this.getWeatherMain(current.weather_code)
        }
      ],
      wind: {
        speed: current.wind_speed_10m,
        deg: current.wind_direction_10m
      },
      visibility: 10000, // Default value
      clouds: 0, // Not provided in free tier
      dt: new Date(current.time).getTime() / 1000,
      timezone: data.timezone
    };
  }

  getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
  }

  getWeatherIcon(code) {
    // Map weather codes to OpenWeatherMap icon codes
    const iconMap = {
      0: '01d', // Clear sky
      1: '02d', // Mainly clear
      2: '03d', // Partly cloudy
      3: '04d', // Overcast
      45: '50d', // Foggy
      48: '50d', // Depositing rime fog
      51: '09d', // Light drizzle
      53: '09d', // Moderate drizzle
      55: '09d', // Dense drizzle
      61: '10d', // Slight rain
      63: '10d', // Moderate rain
      65: '10d', // Heavy rain
      71: '13d', // Slight snow
      73: '13d', // Moderate snow
      75: '13d', // Heavy snow
      95: '11d'  // Thunderstorm
    };
    return iconMap[code] || '01d';
  }

  getWeatherMain(code) {
    if (code <= 3) return 'Clear';
    if (code <= 48) return 'Fog';
    if (code <= 55) return 'Drizzle';
    if (code <= 65) return 'Rain';
    if (code <= 75) return 'Snow';
    if (code <= 95) return 'Thunderstorm';
    return 'Clear';
  }
}

// Usage example for OpenMeteo (no API key required):
/*
const weatherAPI = new OpenMeteoAPI();

// Replace the fetchWeatherData method in WeatherApp class with:
async fetchWeatherData(city) {
  const weatherAPI = new OpenMeteoAPI();
  return await weatherAPI.getWeatherData(city);
}
*/

// Error handling improvements
class WeatherErrorHandler {
  static handleError(error, city) {
    console.error('Weather API Error:', error);
    
    if (error.message.includes('City not found')) {
      return `City "${city}" not found. Please check the spelling and try again.`;
    }
    
    if (error.message.includes('401')) {
      return 'Invalid API key. Please check your OpenWeatherMap API key.';
    }
    
    if (error.message.includes('429')) {
      return 'API rate limit exceeded. Please try again later.';
    }
    
    if (error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
    
    return 'Unable to fetch weather data. Please try again.';
  }
}

// Example of enhanced WeatherApp class with real API
class EnhancedWeatherApp {
  constructor() {
    this.weatherAPI = new OpenMeteoAPI(); // No API key required
    this.elements = {
      // ... same as before
    };
    this.init();
  }

  async getWeather() {
    const city = this.elements.cityInput.value.trim();
    
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }
    
    this.showLoading();
    
    try {
      const weatherData = await this.weatherAPI.getWeatherData(city);
      this.displayWeather(weatherData);
    } catch (error) {
      const errorMessage = WeatherErrorHandler.handleError(error, city);
      this.showError(errorMessage);
    }
  }

  // ... rest of the methods remain the same
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RealWeatherAPI, OpenMeteoAPI, WeatherErrorHandler, EnhancedWeatherApp };
} 