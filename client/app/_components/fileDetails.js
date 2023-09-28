"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./fileDetails.module.css";
import { useDispatch } from "react-redux";
import { openFileModal } from "../redux/modals";
import { animated, useSpring } from "@react-spring/web";
import fileIcon from "../utils/fileIcon";
import icons from "../_assets/icons/icons";
import { setDealModal } from "../redux/modals";
import stringToArray from "../utils/stringToArray";
import SupportModal from "../_modals/supportModal";

export default function FileDetails(props) {
  const { file } = props;
  const [show, setShow] = useState(false);
  const [content, setContent] = useState(false);
  const [support, setSupport] = useState(false);
  const dispatch = useDispatch();

  const popUpEffect = useSpring({
    width: show ? "240px" : "0px",
    config: { duration: 300 },
    onRest: () => {
      setContent(!content);
    },
  });

  useEffect(() => {
    setShow(true);
  }, []);

  const handlePlay = (file) => {
    dispatch(openFileModal(file));
  };

  return (
    <animated.div className={styles.main} style={popUpEffect}>
      <div className={styles.icon__outer}>
        <div className={styles.icon}>
          <Image src={fileIcon(file.type)} alt="icon" fill />
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => handlePlay(file)}>
          <div className={styles.button__icon}>
            <Image src={icons.play} alt="icon" fill />
          </div>
        </button>
        <button className={styles.button}>
          <div className={styles.button__icon}>
            <Image src={icons.love} alt="icon" fill />
          </div>
        </button>
        <button className={styles.button}>
          <div className={styles.button__icon}>
            <Image src={icons.star} alt="icon" fill />
          </div>
        </button>
        <button className={styles.button} onClick={() => setSupport(true)}>
          <div className={styles.button__icon}>
            <Image src={icons.gift} alt="icon" fill />
          </div>
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(setDealModal(true))}
        >
          <div className={styles.button__icon}>
            <Image src={icons.info} alt="icon" fill />
          </div>
        </button>
      </div>
      <div className={styles.file__info}>
        <h4>{file.title}</h4>
        <span>{file.type}</span>
      </div>
      <div className={styles.tags}>
        {stringToArray(file.tags).map((tag, id) => {
          return (
            <div key={id} className={styles.tag__item}>
              {tag}
            </div>
          );
        })}
      </div>
      <div className={styles.description}>
        <h4>Description</h4>
        <p>{file.description}</p>
      </div>
      <div className={styles.details}>
        <h4>Info</h4>
        <div className={styles.detail__box}>
          <span>Size</span>
          <span className={styles.bold}>23mb</span>
        </div>
        <div className={styles.detail__box}>
          <span>Created</span>
          <span className={styles.bold}>{file.createdAt}</span>
        </div>
      </div>
      {support && (
        <SupportModal payementAddress={file.address} setModal={setSupport} />
      )}
    </animated.div>
  );
}
