// US States validation utilities

// State name to state code mapping
export const stateNameToCode: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District of Columbia': 'DC',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  // Include Virgin Islands
  'Virgin Islands': 'VI'
};

// State code to state name mapping (reversed from above)
export const stateCodeToName: Record<string, string> = Object.entries(stateNameToCode).reduce(
  (acc, [name, code]) => {
    acc[code] = name;
    return acc;
  },
  {} as Record<string, string>
);

// Valid state codes
export const validStateCodes = Object.values(stateNameToCode);

/**
 * Validates if the provided string is a valid US state code
 * 
 * @param stateCode The state code to validate (e.g., "CA")
 * @returns True if valid state code, false otherwise
 */
export function isValidStateCode(stateCode: string): boolean {
  if (!stateCode) return false;
  return validStateCodes.includes(stateCode.toUpperCase());
}

/**
 * Validates if the provided string is a valid US state name
 * 
 * @param stateName The state name to validate (e.g., "California")
 * @returns True if valid state name, false otherwise
 */
export function isValidStateName(stateName: string): boolean {
  if (!stateName) return false;
  return stateName.toLowerCase() in Object.keys(stateNameToCode).map(s => s.toLowerCase());
}

/**
 * Converts a state name to its corresponding state code
 * 
 * @param stateName The state name to convert (e.g., "California")
 * @returns The state code if name is valid, undefined otherwise
 */
export function getStateCodeFromName(stateName: string): string | undefined {
  if (!stateName) return undefined;
  
  // Try exact match
  if (stateName in stateNameToCode) {
    return stateNameToCode[stateName];
  }
  
  // Try case-insensitive match
  const lowerStateName = stateName.toLowerCase();
  const matchedState = Object.keys(stateNameToCode).find(
    state => state.toLowerCase() === lowerStateName
  );
  
  return matchedState ? stateNameToCode[matchedState] : undefined;
}

/**
 * Validates and formats state input, accepting either state code or name
 * 
 * @param input User input which could be state code or name
 * @returns Formatted state code if valid, undefined otherwise
 */
export function validateAndFormatStateInput(input: string): string | undefined {
  if (!input) return undefined;
  
  const trimmedInput = input.trim();
  
  // If input is 2 chars, check if it's a valid state code
  if (trimmedInput.length === 2) {
    const upperInput = trimmedInput.toUpperCase();
    return isValidStateCode(upperInput) ? upperInput : undefined;
  }
  
  // Otherwise, try to interpret as state name
  return getStateCodeFromName(trimmedInput);
}

/**
 * Gets a list of state options for dropdown or autocomplete using full state names
 * 
 * @returns Array of objects with label (State Name) and value (State Name)
 */
export function getStateOptions(): Array<{ label: string; value: string }> {
  return Object.keys(stateNameToCode).map(name => ({
    label: name,
    value: name
  }));
}

/**
 * Gets all valid state names as an array
 * 
 * @returns Array of state names
 */
export function getAllStateNames(): string[] {
  return Object.keys(stateNameToCode);
}