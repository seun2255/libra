"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";
import images from "@/app/_assets/images/images";

export default function Community(props) {
  const { community } = props;

  return (
    <Link href={`/communities/${community.id}`}>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.icon}>
            <Image src={images.banner} alt="banner" fill />
          </div>
        </div>
        <div className={styles.base}>
          <h4>{community.title}</h4>
          <p>{community.description}</p>
        </div>
      </div>
    </Link>
  );
}
