"use client";

import styles from "./progressModal.module.css";
import { ThreeDots } from "react-loader-spinner";

export default function ProgressModal(props) {
  const { loading } = props;

  return (
    <div className={styles.container}>
      {!loading ? (
        <div className={styles.main}>
          <h2 className={styles.title}>Saving Video</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>This may take a few seconds</p>
          <ThreeDots
            height="30px"
            width="180px"
            color="#3fa77a"
            visible={true}
          />
        </div>
      ) : (
        <div className={styles.main}>
          <h2 className={styles.title}>File Saved</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>redirecting to home page...</p>
          <div className={styles.button__group}>
            <button>Done</button>
            <button>Upload more</button>
          </div>
        </div>
      )}
    </div>
  );
}
