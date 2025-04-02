import usStates from 'us-state-codes';
import cities from 'cities.json';

export interface City {
  country: string;
  name: string;
  lat: string;
  lng: string;
  state: string;
}

export function validateLocationInput(input: string | undefined | null): boolean {
  // Prevent trim errors by safely handling the input
  if (input === undefined || input === null) {
    return false;
  }
  
  input = input.trim();
  
  // Format validation (City, ST)
  const formatPattern = /^([A-Za-z\s\-\.\']+),\s*([A-Z]{2})$/;
  const formatMatch = input.match(formatPattern);
  
  if (!formatMatch) {
    return false;
  }
  
  const city = formatMatch[1].trim();
  const state = formatMatch[2].trim();
  
  // Check if state is valid using the us-state-codes library
  const stateIsValid = usStates.isValidStateCode(state);
  if (!stateIsValid) {
    return false;
  }
  
  // For simplicity in the demo, we'll validate the state format 
  // and ensure the city name isn't blank
  if (!city || city.length < 2) {
    return false;
  }
  
  return true;
}

export function getLocationInputHelperText(): string {
  return "Please enter a city and state in the format 'City, ST' (e.g., 'Denver, CO')";
}