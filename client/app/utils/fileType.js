export default function fileType(file) {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop().toLowerCase();

  var type = "";

  if (["mp4", "avi", "mov", "mkv"].includes(fileExtension)) {
    type = "video";
  } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
    type = "image";
  } else if (
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"].includes(fileExtension)
  ) {
    type = "doc";
  } else {
    type = "unknown";
  }

  return type;
}
