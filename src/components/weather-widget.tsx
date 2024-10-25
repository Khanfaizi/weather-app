"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}
function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
  //       e.preventDefault();
  //       const TrimmedLocation = location.trim();
  //       if(TrimmedLocation === ""){
  //         setError("please enter a valid location");
  //         setWeather(null);
  //         return;
  //       }

  //       setIsLoading(true);
  //       setError(null);

  //       try {
  //         const response = await fetch(
  //             `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${TrimmedLocation}`
  //         );
  //         if(!response.ok){
  //             throw new Error("city is not found");
  //         }
  //         const data = await response.json();
  //         const weatherData : WeatherData = {
  //             temperature : data.current.temp_c,
  //             description : data.current.condition.text,
  //             location : data.location.name,
  //             unit : "C",
  //         }
  //         setWeather(weatherData)
  //       }catch(error) {
  //         console.log("error fetching weather data", error);
  //         setError("city not found. please try again")
  //         setWeather(null);
  //       }finally {
  //         setIsLoading(false)
  //       }
  // }

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Enter a valid location");
      setWeather(null);
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        location: data.location.name,
        description: data.current.condition.text,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.log("fetching data not Found", error);
      setError("data is Not found");
    } finally {
      setIsLoading(false);
    }
  };

  // function getTemperatureMessage(temperature: number, unit: string): string {
  //   if (unit === "C") {
  //     if (temperature < 0) {
  //       return `It's freezing at ${temperature}°C! Bundle up!`;
  //     } else if (temperature < 10) {
  //       return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
  //     } else if (temperature < 20) {
  //       return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
  //     } else if (temperature < 30) {
  //       return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
  //     } else {
  //       return `It's hot at ${temperature}°C. Stay hydrated!`;
  //     }
  //   } else {
  //     // Placeholder for other temperature units (e.g., Fahrenheit)
  //     return `${temperature}°${unit}`;
  //   }
  // }

  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "its cloudy today";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }


  function getLocationWeather(location : string) : string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;

    return `${location} ${isNight ? "at Night" : "During the Day"}`;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              placeholder="Enter a city name"
            />
            <Button disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
            </Button>
          </form>
          {weather && (
            <div className="mt-4 grid gap-2">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>
              <div className="flex item gap-2">
                <CloudIcon className="w-6 h-6"/>
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              <div className="flex item gap-2">
                <MapPinIcon className="w-6 h-6"/>
                <div>{getWeatherMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WeatherWidget;
