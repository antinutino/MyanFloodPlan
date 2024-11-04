import React, { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLocation } from 'react-router-dom';

const Weatherpred = ({ onRainData }) => { // Adding onRainData prop
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { lat, lng } = location.state || {};

  const params = {
    latitude: lat,
    longitude: lng,
    hourly: ['temperature_2m', 'relative_humidity_2m', 'rain'],
    past_days: 3,
    forecast_days: 7,
  };

  const url = "https://api.open-meteo.com/v1/forecast";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();

        const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const weatherData = {
          hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
              (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString()
            ),
            temperature2m: hourly.variables(0).valuesArray(),
            relativeHumidity2m: hourly.variables(1).valuesArray(),
            rain: hourly.variables(2).valuesArray(),
          },
        };

        const combinedData = weatherData.hourly.time.map((time, index) => ({
          time,
          temperature: weatherData.hourly.temperature2m[index],
          humidity: weatherData.hourly.relativeHumidity2m[index],
          rain: weatherData.hourly.rain[index],
        }));

        setWeatherData(combinedData);

        // Pass rain data to parent via the onRainData prop
        const rainData = combinedData.map(data => ({ time: data.time, rain: data.rain }));
        onRainData(rainData); // Invoke callback with rain data

        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lng, onRainData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weatherData) {
    return <div>No weather data available.</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className='w-full lg:w-3/4 '>
      <h1 className='text-center'>Weather Data Graph</h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Date', position: 'insideBottomRight', offset: 0 }} 
            tickFormatter={formatDate}
          />
          <YAxis label={{ value: 'Temperature & Humidity', angle: -90, position: 'insideLeft' }} />
          <YAxis 
            yAxisId="rain" 
            orientation="left" 
            label={{ value: 'Rain (mm)', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#ff6384" name="Temperature (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#36a2eb" name="Relative Humidity (%)" />
          <Bar dataKey="rain" fill="#d6a2ec" name="Rain (mm)" yAxisId="rain" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Weatherpred;
