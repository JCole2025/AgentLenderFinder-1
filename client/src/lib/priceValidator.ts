export const MIN_PROPERTY_PRICE = 100000;

export function validatePrice(price: string): boolean {
  // Remove commas and dollar signs
  const cleanedPrice = price.replace(/[$,]/g, '');
  
  // Check if it's a valid number
  if (!/^\d+$/.test(cleanedPrice)) {
    return false;
  }
  
  // Convert to number and check minimum
  const numericPrice = Number(cleanedPrice);
  return !isNaN(numericPrice) && numericPrice >= MIN_PROPERTY_PRICE;
}

export function validatePriceRange(minPrice: string, maxPrice: string): boolean {
  // First validate each price individually
  if (!validatePrice(minPrice) || !validatePrice(maxPrice)) {
    return false;
  }
  
  // Remove non-numeric characters and convert to numbers
  const minNumeric = Number(minPrice.replace(/[$,]/g, ''));
  const maxNumeric = Number(maxPrice.replace(/[$,]/g, ''));
  
  // Ensure max is greater than min
  return maxNumeric > minNumeric;
}

export function formatPrice(price: string): string {
  // Remove non-numeric characters
  const numericOnly = price.replace(/[^0-9]/g, '');
  
  if (!numericOnly) {
    return '';
  }
  
  // Convert to number and format with commas
  const numericPrice = Number(numericOnly);
  return '$' + numericPrice.toLocaleString('en-US');
}

export function getDefaultMinPrice(): string {
  return '$' + MIN_PROPERTY_PRICE.toLocaleString('en-US');
}