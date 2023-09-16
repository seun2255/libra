"use client";

import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/app/_assets/icons/icons";
import Link from "next/link";

export default function Create() {
  return (
    <div className={styles.container}>
      <div className={styles.option}>
        <h2 className={styles.header}>Upload File</h2>
        <Link href={"/create/upload-file"}>
          <div className={styles.box}>
            <div className={styles.icon__container}>
              <div className={styles.icon}>
                <Image src={icons.upload} fill alt="icon" />
              </div>
            </div>
            <div className={styles.details}>
              <p className={styles.upper__text}>upload a single file</p>
              <p className={styles.lower__text}>
                upload a single video/picture/document.
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className={styles.option}>
        <h2 className={styles.header}>Upload Folder</h2>
        <Link href={"/create/upload-folder"}>
          <div className={styles.box}>
            <div className={styles.icon__container}>
              <div className={styles.icon}>
                <Image src={icons.folder} fill alt="icon" />
              </div>
            </div>
            <div className={styles.details}>
              <p className={styles.upper__text}>Upload a Folder</p>
              <p className={styles.lower__text}>
                upload a folder of related content
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
