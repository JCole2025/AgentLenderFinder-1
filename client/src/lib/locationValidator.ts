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
  // If empty, undefined, or not in the format "city, state", reject
  if (!input || typeof input !== 'string' || !input.includes(',')) {
    return false;
  }

  const parts = input.split(',');
  if (parts.length !== 2) {
    return false;
  }

  const cityName = parts[0].trim();
  const stateCode = parts[1].trim();
  
  // Check if state is valid
  const stateIsValid = usStates.sanitizeStateCode(stateCode) !== undefined;
  if (!stateIsValid) {
    return false;
  }

  // For simplicity in the demo, we'll just validate the state format 
  // and ensure the city name isn't blank
  if (!cityName || cityName.length < 2) {
    return false;
  }

  // For production use, you would check that the city exists in the specified state
  // using a more comprehensive database like 'cities.json'
  
  return true;
}

export function getLocationInputHelperText(): string {
  return "Enter a valid city and state, e.g. 'Denver, CO'";
}