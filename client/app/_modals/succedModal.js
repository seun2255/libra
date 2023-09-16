"use client";

import Image from "next/image";
import styles from "./succesModal.module.css";
import icons from "@/app/_assets/icons/icons";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";

export default function SuccesModal(props) {
  const { text } = props;
  const [show, setShow] = useState(false);

  const popUpEffect = useSpring({
    opacity: show ? 1 : 0,
    right: show ? "0px" : "-100px",
    config: { duration: 200 },
  });

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }, []);

  return (
    <animated.div className={styles.container} style={popUpEffect}>
      <span className={styles.text}>{text}</span>
      <div className={styles.icon}>
        <Image src={icons.succesTick} alt="tick icon" fill />
      </div>
    </animated.div>
  );
}
