"use client";

import { useState, useEffect } from "react";
import styles from "./fileDetails.module.css";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "@react-spring/web";

export default function FileDetails() {
  const [show, setShow] = useState(false);

  const popUpEffect = useSpring({
    opacity: show ? 1 : 0,
    right: show ? "0px" : "-100px",
    config: { duration: 200 },
  });

  useEffect(() => {
    setShow(true);
  }, []);

  return <div className={styles.main}></div>;
}
