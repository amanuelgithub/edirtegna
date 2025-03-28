export const ToNumber = (input: any) => {
  const value = input?.value;
  if (value === undefined || value === null) {
    return value;
  }

  // Check if value is a boolean
  if (typeof value === 'boolean') {
    return value;
  }

  // Check if value is an object
  if (typeof value === 'object' && value !== null) {
    return value;
  }

  // Check if value is an array
  if (Array.isArray(value)) {
    return value;
  }

  // Convert value to string and remove commas
  const stringValue = value.toString().replace(/,/g, '');

  // Check if stringValue is a valid number
  if (!isNaN(+stringValue)) {
    return Number(stringValue);
  }
  return value;
};
