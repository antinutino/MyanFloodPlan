import React, { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import conf from '../conf/conf';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLocation, useParams } from 'react-router-dom';
import Weatherpred from './Weatherpred';
import emailjs from 'emailjs-com';

const FloodPred = () => {
  const { latitude: paramLat, longitude: paramLng } = useParams(); // Get params from URL
  const location = useLocation();
  const { lat: stateLat, lng: stateLng, userEmail: stateEmail } = location.state || {};

  // Use params from URL or fallback to state
  const latitude = paramLat || stateLat; 
  const longitude = paramLng || stateLng; 
  const userEmail = stateEmail; // No need to use params.userEmail here
  const [riverData, setRiverData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location_name, setLocationName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [timezoneAbbreviation, setTimezoneAbbreviation] = useState('');
  const [floodPrediction, setFloodPrediction] = useState('');

  // Parameters for fetching the flood data
  
  const fetchParams = {
    latitude,
    longitude,
    daily: ['river_discharge', 'river_discharge_max'],
    past_days: 1,
    forecast_days: 7,
  };

  const url = "https://flood-api.open-meteo.com/v1/flood";
 console.log(fetchParams);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await fetchWeatherApi(url, fetchParams);
        const response = responses[0];
        const response1 = await fetch(`https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${conf.goMapsApiKey}`);
        const data = await response1.json();
        setLocationName(data.results[0].formatted_address);

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const daily = response.daily();

        setTimezone(timezone);
        setTimezoneAbbreviation(timezoneAbbreviation);

        const range = (start, stop, step) =>
          Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const weatherData = {
          daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
              (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            riverDischarge: daily.variables(0).valuesArray(),
            riverDischargeMax: daily.variables(1).valuesArray(),
          },
        };

        const combinedData = weatherData.daily.time.map((time, index) => ({
          time,
          riverDischarge: weatherData.daily.riverDischarge[index],
          riverDischargeMax: weatherData.daily.riverDischargeMax[index],
        }));

        setRiverData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching river discharge data:', error);
        setError("Error fetching river discharge data");
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]); // Trigger the useEffect whenever latitude or longitude changes

  const handleRainData = (rainData) => {
    setRainData(rainData); 
  };

  const analyzeFloodRisk = () => {
    const RAIN_THRESHOLD = 50; 
    const DISCHARGE_THRESHOLD = 500; 

    let isHeavyRain = rainData.some(data => data.rain >= RAIN_THRESHOLD);
    let isHighDischarge = riverData.some(data => data.riverDischarge >= DISCHARGE_THRESHOLD);

    if (isHeavyRain && isHighDischarge) {
      setFloodPrediction('High risk of flooding due to heavy rainfall and elevated river discharge.');
      sendFloodAlertEmail(userEmail, 'High risk of flooding', `There is a high risk of flooding due to heavy rainfall and high river discharge in ${location_name}. Please take the following precautions:\n\n1. Move to higher ground immediately.\n2. Avoid crossing floodwaters.\n3. Stay informed via local weather updates.`);
    } else if (isHeavyRain) {
      setFloodPrediction('Moderate risk of flooding due to heavy rainfall. Monitor river discharge closely.');
    } else if (isHighDischarge) {
      setFloodPrediction('Moderate risk of flooding due to high river discharge.');
    } else {
      setFloodPrediction('No significant flood risk detected at this time.');
    }
  };

  useEffect(() => {
    if (rainData.length > 0 && riverData.length > 0) {
      analyzeFloodRisk(); 
    }
  }, [rainData, riverData]);

  const sendFloodAlertEmail = ()=> {
    const templateParams = {
      to_name: user.email,
      subject: "Alert Message!",
      message: "Your area is in red alert for flood. Be Safe and Be carefull. Take Your safe Position.",
    };

    emailjs
      .send(
        'service_qu7is8n', // Replace with your EmailJS service ID
        'template_y4oe32a', // Replace with your EmailJS template ID
        templateParams,
        'LX7QFDR-uqjkStq-_' // Replace with your EmailJS user ID
      )
      .then(
        (result) => {
          console.log('Email successfully sent!', result.text);
        },
        (error) => {
          console.error('Error sending email:', error.text);
        }
      );
  };

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!riverData.length) {
    return <div>No river discharge data available.</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className='w-full lg:w-3/4 h-screen'>
      <h1 className="text-center">River Discharge Data Graph</h1>
      <div className="text-center mb-4">
        <p><strong>Location:</strong> {location_name}</p>
        <p><strong>Timezone:</strong> {timezone} ({timezoneAbbreviation})</p>
      </div>

      <ResponsiveContainer className="w-full" height={400}>
        <LineChart data={riverData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Date', position: 'insideBottomRight', offset: 0 }} 
            tickFormatter={formatDate}
          />
          <YAxis label={{ value: 'Discharge (m³/s)', angle: -90, position: 'insideLeft' }} />
          <Tooltip className="w-1/2" formatter={(value, name) => [value, name]} />
          <Legend />
          <Line type="monotone" dataKey="riverDischarge" stroke="#ff6384" name="River Discharge (m³/s)" />
          <Line type="monotone" dataKey="riverDischargeMax" stroke="#36a2eb" name="Max Discharge (m³/s)" />
        </LineChart>
      </ResponsiveContainer>

      <div className='my-8'>
        <Weatherpred className='mt-4' onRainData={handleRainData} />
      </div>

      <div className="text-center my-6">
        <h2 className="text-lg font-bold">Today's Flood Data</h2>
        <p><strong>Rainfall:</strong> {rainData[3] ? rainData[3].rain : 'N/A'} mm</p>
        <p><strong>River Discharge:</strong> {riverData[1] ? riverData[1].riverDischarge : 'N/A'} m³/s</p>
      </div>

      <div className="mb-8 p-6 bg-green-700 rounded-xl">
        <h2 className="text-center text-xl  text-red-600 font-bold">Flood Prediction</h2>
        <p className="text-center text-lg font-bold ">{floodPrediction}</p>
      </div>
    </div>
  );
};

export default FloodPred;
