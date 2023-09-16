"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import filterbyTag from "./utils/filter";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayedVideos, setDisplayedVideos] = useState();

  const handleSelect = (selected) => {
    if (selected === selectedCategory) {
      setSelectedCategory("");
      setDisplayedVideos(videos);
    } else {
      setSelectedCategory(selected);
      const query = filterbyTag(videos, selected);
      setDisplayedVideos(query);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}></div>
    </div>
  );
}

const categories = [
  "music",
  "education",
  "tech",
  "software",
  "history",
  "games",
  "anime",
  "DIY",
  "dance",
  "sport",
  "cartoon",
  "vlog",
  "science",
];
