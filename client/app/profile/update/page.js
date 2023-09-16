"use client";

import Head from "next/head";
import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/app/_assets/icons/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { updateUserProfile } from "@/app/database";
import lighthouse from "@lighthouse-web3/sdk";
import { ThreeDots } from "react-loader-spinner";
import linkCreator from "@/app/utils/linkCreator";
import SuccesModal from "@/app/_modals/succedModal";

export default function Settings() {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const [pic, setPic] = useState(
    user.profilePic !== "" ? user.profilePic : icons.profile
  );
  const [username, setUsername] = useState(user.username);
  const [about, setAbout] = useState(user.about);
  const [picUpload, setPicUpload] = useState("");
  const [picLoader, setPicLoader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [succes, setSucces] = useState(false);

  const handlePicUpload = async (event) => {
    setPicLoader(true);
    let file = event.target.files;

    const progressCallback = (progressData) => {
      let percentageDone =
        100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
      console.log(percentageDone);
    };

    const dealParams = {
      num_copies: 2,
      repair_threshold: 28800,
      renew_threshold: 240,
      miner: ["t017840"],
      network: "calibration",
      add_mock_data: 2,
    };

    if (file) {
      const uploadResponse = await lighthouse.upload(
        file,
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
        false,
        null,
        progressCallback
      );
      console.log("File Status:", uploadResponse);
      const url = linkCreator(uploadResponse.data.Hash);
      console.log(url);
      setPicUpload(url);
      setPic(url);
    }
    setPicLoader(false);
  };

  const handleRemove = () => {
    setPic(icons.profile);
    setPicUpload("");
  };

  const handleSave = async () => {
    setUploading(true);
    updateUserProfile(username, about, picUpload, "", user.address).then(() => {
      setUploading(false);
      setSucces(true);
      setTimeout(() => {
        setSucces(false);
      }, 4000);
    });
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Account</h2>
      <div className={styles.form}>
        <div className={styles.inner}>
          <div className={styles.image__box}>
            <div className={styles.pic}>
              {picLoader ? (
                <ThreeDots
                  height="40%"
                  width="100%"
                  color="blueviolet"
                  visible={true}
                />
              ) : (
                <Image fill src={pic} alt="profile pic" />
              )}
            </div>
            <label htmlFor="upload" className={styles.upload__button}>
              Upload
            </label>
            <input
              id="upload"
              type="file"
              style={{ display: "none" }}
              onChange={handlePicUpload}
            />
            <button className={styles.remove__button} onClick={handleRemove}>
              Remove
            </button>
          </div>
          <div className={styles.input__box}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.input__box}>
            <label className={styles.label}>About</label>
            <textarea
              className={styles.about__input}
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          {uploading ? (
            <button className={styles.save__button}>Uploading...</button>
          ) : (
            <button className={styles.save__button} onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
      {succes && <SuccesModal text={"Changes Saved"} />}
    </section>
  );
}
