function filterbyTag(videos, searchText) {
  const results = [];
  for (const video of videos) {
    for (const tag of video.tags) {
      if (tag.includes(searchText)) {
        results.push(video);
      }
    }
  }
  return results;
}

export default filterbyTag;
