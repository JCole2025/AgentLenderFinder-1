export const MIN_PROPERTY_PRICE = 75000;

export function validatePrice(price: string | undefined | null): boolean {
  // Check if price is defined
  if (!price) {
    return false;
  }
  
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

export function validatePriceRange(minPrice: string | undefined | null, maxPrice: string | undefined | null): boolean {
  // First validate each price individually
  if (!validatePrice(minPrice) || !validatePrice(maxPrice)) {
    return false;
  }
  
  // At this point we know both values are non-null strings because validatePrice returned true
  const minNumeric = Number((minPrice as string).replace(/[$,]/g, ''));
  const maxNumeric = Number((maxPrice as string).replace(/[$,]/g, ''));
  
  // Ensure max is greater than min
  return maxNumeric > minNumeric;
}

export function formatPrice(price: string | undefined | null): string {
  // Handle undefined or null
  if (!price) {
    return '';
  }
  
  // Remove non-numeric characters
  const numericOnly = price.replace(/[^0-9]/g, '');
  
  if (!numericOnly) {
    return '';
  }
  
  // Convert to number and format with commas
  const numericPrice = Number(numericOnly);
  return numericPrice.toLocaleString('en-US');
}

export function getDefaultMinPrice(): string {
  return MIN_PROPERTY_PRICE.toLocaleString('en-US');
}