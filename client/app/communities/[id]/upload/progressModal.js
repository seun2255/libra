"use client";

import styles from "./progressModal.module.css";
import { ThreeDots } from "react-loader-spinner";
import { useSpring, animated } from "@react-spring/web";

export default function ProgressModal(props) {
  const { loading, progress, uploading, encrypting } = props;

  const animateProgress = useSpring({
    width: `${progress}%`,
    config: { duration: 1000 },
  });

  return (
    <div className={styles.container}>
      {uploading ? (
        <div className={styles.main}>
          <h2 className={styles.title}>Uploading File</h2>
          <hr className={styles.line__break} />
          <div className={styles.progress__bar}>
            <animated.div
              className={styles.progress}
              style={animateProgress}
            ></animated.div>
          </div>
        </div>
      ) : encrypting ? (
        <div className={styles.main}>
          <h2 className={styles.title}>Encrypting File</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>This may take a few seconds</p>
          <ThreeDots
            height="30px"
            width="180px"
            color="#597dffb7"
            visible={true}
          />
        </div>
      ) : !loading ? (
        <div className={styles.main}>
          <h2 className={styles.title}>Saving File</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>This may take a few seconds</p>
          <ThreeDots
            height="30px"
            width="180px"
            color="#597dffb7"
            visible={true}
          />
        </div>
      ) : (
        <div className={styles.main}>
          <h2 className={styles.title}>File Saved</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>redirecting to home page...</p>
        </div>
      )}
    </div>
  );
}
