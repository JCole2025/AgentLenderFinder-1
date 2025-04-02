declare module 'us-state-codes' {
  export function sanitizeStateCode(state: string): string | undefined;
  export function getStateCodeByStateName(state: string): string | undefined;
  export function getStateNameByStateCode(stateCode: string): string | undefined;
  export function isValidStateCode(stateCode: string): boolean;
  export function isValidStateName(stateName: string): boolean;
}

declare module 'cities.json' {
  interface City {
    country: string;
    name: string;
    lat: string;
    lng: string;
    state: string;
  }
  const cities: City[];
  export default cities;
}