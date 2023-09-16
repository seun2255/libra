function getPath(path) {
  const parts = path.split("/");
  return parts[1] || ""; // Return the second part or an empty string if it doesn't exist
}

export default getPath;
