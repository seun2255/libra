"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./supportModal.module.css";
import icons from "@/app/_assets/icons/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sendXDC, sendHaven } from "../api";
import { recordTransaction } from "../database";
import SuccesModal from "./succedModal";
import { ThreeDots } from "react-loader-spinner";
import { timeStamp } from "../utils/dateFunctions";

export default function SupportModal(props) {
  const { setModal, payementAddress } = props;
  const { user } = useSelector((state) => state.user);
  const [custom, setCustom] = useState(true);
  const [tipAmount, setTipAmount] = useState(25);
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectPrice = (price, id) => {
    setTipAmount(price);
    setCustom(false);
    setSelectedAmount(id);
  };

  const selectCurrecy = (id) => {
    setSelectedCurrency(id);
  };

  const handleSend = () => {
    setLoading(true);
    console.log("Reached here");
    if (user.address !== payementAddress) {
      if (selectedCurrency === 0) {
        if (tipAmount <= user.balance) {
          sendXDC(payementAddress, tipAmount).then(() => {
            recordTransaction(user.address, {
              type: "Support",
              date: timeStamp(),
              amount: tipAmount,
              coin: "xdc",
            }).then(() => {
              recordTransaction(payementAddress, {
                type: "Gift",
                date: timeStamp(),
                amount: tipAmount,
                coin: "xdc",
              }).then(() => {
                console.log("Got here");
                setSucces(true);
                setLoading(false);
                setTimeout(() => {
                  setSucces(false);
                }, 4000);
              });
            });
          });
        } else {
          alert("You dont have enough xdc");
        }
      } else {
        if (tipAmount <= user.balance) {
          sendHaven(payementAddress, tipAmount).then(() => {
            recordTransaction(user.address, {
              type: "Support",
              date: timeStamp(),
              amount: tipAmount,
              coin: "hvn",
            }).then(() => {
              recordTransaction(payementAddress, {
                type: "Gift",
                date: timeStamp(),
                amount: tipAmount,
                coin: "xdc",
              }).then(() => {
                console.log("Got here");
                setSucces(true);
                setLoading(false);
                setTimeout(() => {
                  setSucces(false);
                }, 4000);
              });
            });
          });
        } else {
          alert("You dont have enough hvn");
        }
      }
    } else {
      alert("You can't send yourself gifts lol");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.close} onClick={() => setModal(false)}>
          <Image src={icons.cancel} alt="cancel icon" fill />
        </div>
        <h3 className={styles.title}>Your support can make a difference</h3>
        <div className={styles.token__choice}>
          {currency.map((item, id) => {
            return (
              <button
                key={id}
                style={{
                  borderRadius: id === 0 ? "7px 0 0 7px" : "0 7px 7px 0",
                  backgroundColor:
                    selectedCurrency === id ? "rgb(4, 122, 219)" : null,
                }}
                onClick={() => selectCurrecy(id)}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className={styles.extra}>
          Show this creator your appreciation by sending a donation.
        </p>

        <div className={styles.amount__choice}>
          {amount.map((amount, id) => {
            return (
              <button
                key={id}
                style={{
                  borderRadius: amount === 1 ? "7px 0 0 7px" : 0,
                  backgroundColor:
                    selectedAmount === id ? "rgb(4, 122, 219)" : null,
                }}
                onClick={() => selectPrice(amount, id)}
              >
                {amount}
              </button>
            );
          })}
          <button
            style={{
              borderRadius: "0 7px 7px 0",
              backgroundColor: selectedAmount === 5 ? "rgb(4, 122, 219)" : null,
            }}
            onClick={() => {
              setCustom(true);
              setSelectedAmount(5);
            }}
          >
            custom
          </button>
        </div>

        {custom && (
          <input
            type="number"
            className={styles.custom__input}
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
          />
        )}
        <p className={styles.tip__details}>
          Send a tip directly from your attached card.
        </p>
        <button className={styles.send__button} onClick={handleSend}>
          {loading ? (
            <ThreeDots
              height="50%"
              width="100px"
              color="#ffffff"
              visible={true}
            />
          ) : (
            `Send a ${tipAmount} ${currency[selectedCurrency]} Tip`
          )}
        </button>
      </div>
      {succes && <SuccesModal text={"Donation recieved"} />}
    </div>
  );
}

const amount = [1, 5, 10, 25, 100];
const currency = ["xdc", "hvn"];
