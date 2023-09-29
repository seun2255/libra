"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./fileDeal.module.css";
import icons from "@/app/_assets/icons/icons";
import { setNewUserModal } from "@/app/redux/modals";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setDealModal } from "@/app/redux/modals";
import { ThreeDots } from "react-loader-spinner";
import { getDeal } from "../lighthouse";

export default function FileDeal(props) {
  const { cid } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [dealCompleted, setDealCompleted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const deal = await getDeal(cid);
      console.log(deal);
      setData(deal);
    };

    // getDeal(cid).then((deal) => {
    //   if (deal.dealInfo.length === 0) {
    //     setLoading(false);
    //     console.log("something");
    //   } else {
    //     console.log("Reached here");
    //     setData(deal);
    //     setTimeout(() => {
    //       setDealCompleted(true);
    //       setLoading(false);
    //     }, 2000);
    //   }
    // });

    getData();
  }, []);

  useEffect(() => {
    if (data.dealInfo) {
      console.log(data);
      console.log(data.dealInfo.length === 0);
      if (data.dealInfo.length === 0) {
        setLoading(false);
        console.log("something");
      } else {
        console.log("Reached here");
        setDealCompleted(true);
        setLoading(false);
      }
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {loading ? (
          <ThreeDots
            height="70%"
            width="100%"
            color="#597dffb7"
            visible={true}
          />
        ) : !dealCompleted ? (
          <>
            <div
              className={styles.close}
              onClick={() => dispatch(setDealModal(false))}
            >
              <Image src={icons.cancel} alt="cancel icon" fill />
            </div>
            <h2 className={styles.title}>Deal in Progress</h2>
            <hr className={styles.line__break} />
            <div className={styles.detail}>
              <h4>Your storage deal is in progress</h4>
              <span>check back after some time for deal details</span>
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.close}
              onClick={() => dispatch(setDealModal(false))}
            >
              <Image src={icons.cancel} alt="cancel icon" fill />
            </div>
            <h2 className={styles.title}>File Deal</h2>
            <hr className={styles.line__break} />
            <div className={styles.detail}>
              <h4>Piece CID</h4>
              <span>{data.pieceCID}</span>
            </div>
            <div className={styles.detail}>
              <h4>Deal Info</h4>
              <span>deal uuid: {data.dealInfo[0].dealUUID}</span>
              <span>deal Id {data.dealInfo[0].dealId}</span>
              <span>storage provider: {data.dealInfo[0].storageProvider}</span>
            </div>
            <a
              target="_blank"
              href={`http://calibration.filfox.info/en/deal/${data.dealInfo[0].dealId}`}
            >
              <button className={styles.profile__button}>View Deal</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
