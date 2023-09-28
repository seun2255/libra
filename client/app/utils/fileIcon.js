import icons from "../_assets/icons/icons";

export default function fileIcon(fileType) {
  if (fileType === "video") {
    return icons.video;
  } else if (fileType === "image") {
    return icons.image;
  } else {
    return icons.document;
  }
}
