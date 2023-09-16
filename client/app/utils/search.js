const searchFiles = (files, text) => {
  var check = "";
  const end = text.length;
  check = text.slice(0, end);
  var result = [];
  videos.map((video) => {
    if (video.title.toLowerCase().slice(0, end) === check.toLowerCase())
      result.push(video);
  });

  return result;
};

export default searchFiles;
