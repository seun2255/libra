export default function fileExtension(file) {
  const fileName = file.name;
  const fileExtension = fileName.slice(
    ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
  );

  return fileExtension.toLowerCase();
}
