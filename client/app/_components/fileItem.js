"use client";

import Image from "next/image";
import styles from "./fileItem.module.css";
import fileIcon from "../utils/fileIcon";

export default function FileItem(props) {
  const { file, select } = props;

  function getMimeTypeCategory(mimeType) {
    const slashIndex = mimeType.indexOf("/");
    if (slashIndex !== -1) {
      return mimeType.substring(0, slashIndex);
    } else {
      return mimeType; // Return the full string if there is no slash
    }
  }

  return (
    <div className={styles.main} onClick={() => select(file)}>
      <div className={styles.top}>
        <div className={styles.icon}>
          <Image
            src={fileIcon(getMimeTypeCategory(file.type))}
            alt="icon"
            fill
          />
        </div>
        <div className={styles.details}>
          <h4>{file.title}</h4>
          <span>{file.createdAt}</span>
        </div>
      </div>
      <div className={styles.base}>12.34 mb</div>
    </div>
  );
}
