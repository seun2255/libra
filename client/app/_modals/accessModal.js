"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./accessModal.module.css";
import icons from "@/app/_assets/icons/icons";

export default function AccessModal(props) {
  const { isChrome, hasDataverse } = props;

  return (
    <div className={styles.container}>
      {!isChrome && (
        <div className={styles.main}>
          <div className={styles.close}>
            <Image src={icons.cancel} alt="cancel icon" fill />
          </div>
          <h2 className={styles.title}>Use Chrome Browser</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>
            this app makes use of dataverse and so requires chrome browser
          </p>
        </div>
      )}
      {isChrome && !hasDataverse && (
        <div className={styles.main}>
          <div className={styles.close}>
            <Image src={icons.cancel} alt="cancel icon" fill />
          </div>
          <h2 className={styles.title}>Dataverse not Installed</h2>
          <hr className={styles.line__break} />
          <p className={styles.info}>
            You need dataverse to be able to acces this app
          </p>
          <a
            target="_blank"
            href="https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead"
          >
            <button className={styles.profile__button}>
              Install Dataverse
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
