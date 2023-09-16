"use client";

import Image from "next/image";
import styles from "./sidebar.module.css";
import icons from "@/app/_assets/icons/icons";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import getPath from "@/app/utils/getPath";

export default function SideBar(props) {
  const [expanded, setExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [action, setAction] = useState("out");
  var pathname = usePathname();
  if (pathname === "/") pathname = "/home";

  /**
   * Event functions
   */

  const handleExpand = () => {
    if (action === "out") {
      setAction("over");
      setExpanded(true);
    } else {
      setAction("out");
      setShowText(false);
      setExpanded(false);
    }
  };

  /**
   * SReact pring Hooks
   */
  const sidebar = useSpring({
    width: expanded ? "190px" : "70px",
    config: { duration: 300 },
    onRest: () => {
      if (action === "over") setShowText(true);
    },
  });

  const icon = useSpring({});

  // const expandIcon = useSpring({
  //   transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  //   config: { duration: 300 },
  // });

  const buttons = useSpring({
    config: { duration: 300 },
  });

  const animateText = useSpring({
    display: "inline-block",
  });

  const menuAnimation = useSpring({
    transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
  });

  /**
   * Static variables
   */
  const options = [
    { icon: icons.home, text: "Home", link: "/" },
    { icon: icons.create, text: "Create", link: "/create" },
    { icon: icons.finance, text: "Finances", link: "/finances" },
    { icon: icons.requests, text: "Requests", link: "/requests" },
    { icon: icons.settings, text: "Profile", link: "/profile/update" },
  ];

  return (
    <animated.div className={styles.container} style={sidebar}>
      <div className={styles.logo__box}>
        {showText && (
          <animated.span className={styles.logo__text} style={animateText}>
            <Image src={icons.logo} alt="text" fill />
          </animated.span>
        )}
        <div className={styles.logo}>
          <Image alt="logo" src={icons.library} fill />
        </div>
      </div>
      <div className={styles.open__box} onClick={handleExpand}>
        <animated.div className={styles.open__icon} style={menuAnimation}>
          <Image alt="logo" src={icons.expand} fill />
        </animated.div>
      </div>
      <animated.div className={styles.nav__buttons} style={buttons}>
        {options.map((option, index) => {
          return (
            <Link href={option.link} key={index}>
              <div
                className={styles.nav__button__item}
                style={{
                  backgroundColor:
                    getPath(pathname) === option.text.toLowerCase()
                      ? "#6a76cb"
                      : "transparent",
                  borderLeft:
                    getPath(pathname) === option.text.toLowerCase()
                      ? "3px solid #303fb3"
                      : "none",
                }}
              >
                <div className={styles.icon__box}>
                  <Image alt="icon" fill src={option.icon} />
                </div>
                {showText && (
                  <animated.span
                    className={styles.nav__text}
                    style={animateText}
                  >
                    {option.text}
                  </animated.span>
                )}
              </div>
            </Link>
          );
        })}
      </animated.div>
    </animated.div>
  );
}
