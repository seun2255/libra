export default function stringToArray(inputString) {
  if (typeof inputString !== "string") {
    throw new Error("Input must be a string");
  }

  // Split the input string by commas and remove leading/trailing spaces
  const itemsArray = inputString.split(",").map((item) => item.trim());

  return itemsArray;
}
