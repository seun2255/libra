"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./newUser.module.css";
import icons from "@/app/_assets/icons/icons";
import { setNewUserModal } from "@/app/redux/modals";
import { useDispatch } from "react-redux";

export default function NewUser() {
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div
          className={styles.close}
          onClick={() => dispatch(setNewUserModal(false))}
        >
          <Image src={icons.cancel} alt="cancel icon" fill />
        </div>
        <h2 className={styles.title}>Seems your New here</h2>
        <hr className={styles.line__break} />
        <p className={styles.info}>Take a few seconds to update your profile</p>
        <Link
          href={"/profile/update"}
          onClick={() => dispatch(setNewUserModal(false))}
        >
          <button className={styles.profile__button}>Go to Profile</button>
        </Link>
      </div>
    </div>
  );
}
