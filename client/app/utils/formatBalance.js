function formatToTwoDecimalPlaces(numberString) {
  const parsedNumber = parseFloat(numberString);
  if (isNaN(parsedNumber)) {
    return "Invalid number";
  }

  const truncatedNumber = Math.floor(parsedNumber * 100) / 100;

  return truncatedNumber.toFixed(2);
}

export { formatToTwoDecimalPlaces };
