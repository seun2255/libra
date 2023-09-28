"use client";

import Head from "next/head";
import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/app/_assets/icons/icons";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import Table from "./table";
import { formatToTwoDecimalPlaces } from "@/app/utils/formatBalance";
import { buyTokens, sellTokens } from "@/app/api";
import { recordTransaction } from "@/app/database";
import { timeStamp } from "@/app/utils/dateFunctions";
import SuccesModal from "@/app/_modals/succedModal";
import { useDispatch } from "react-redux";

export default function Finance() {
  const { user } = useSelector((state) => state.user);
  const [coin, setCoin] = useState("xdc");
  const [swapAmount, setSwapAmount] = useState(0);
  const [succes, setSucces] = useState(false);
  const [succesText, setSuccesText] = useState("");
  console.log(user);

  const dispatch = useDispatch();

  const handleSwitch = () => {
    if (coin === "fil") {
      setCoin("pri");
    } else {
      setCoin("fil");
    }
  };

  const handleSwap = () => {
    if (swapAmount > 0) {
      if (coin === "fil") {
        const amount = swapAmount.toString();
        buyTokens(amount).then(() => {
          console.log("got here");
          recordTransaction(user.address, {
            type: "Swap",
            date: timeStamp(),
            amount,
            coin: "fil",
          }).then(() => {
            setSuccesText("Bought Tokens");
            setSucces(true);
            setTimeout(() => {
              setSucces(false);
            }, 4000);
          });
        });
      } else {
        const amount = swapAmount.toString();
        sellTokens(amount).then(() => {
          recordTransaction(user.address, {
            type: "Swap",
            date: timeStamp(),
            amount: amount,
            coin: "pri",
          }).then(() => {
            setSuccesText("Sold Tokens");
            setSucces(true);
            setTimeout(() => {
              setSucces(false);
            }, 4000);
          });
        });
      }
    } else {
      alert("Enter an amount");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.top__section}>
        <div className={styles.left}>
          <div className={styles.left__top}>
            <h3>My Balance</h3>
            <div className={styles.balances__container}>
              <div className={styles.balance__item}>
                <div className={styles.token__icon__container}>
                  <div className={styles.token__icon}>
                    <Image src={icons.filLogo} alt="icon" fill />
                  </div>
                </div>
                <div className={styles.token__details}>
                  <p className={styles}>fil balance</p>
                  <h3>{formatToTwoDecimalPlaces(user.balance)} ETH</h3>
                </div>
              </div>
              <div
                className={styles.balance__item}
                style={{ backgroundColor: "#ecefff" }}
              >
                <div
                  className={styles.token__icon}
                  style={{ width: "25px", height: "25px" }}
                >
                  <Image src={icons.logo} alt="icon" fill />
                </div>
                <div className={styles.token__details}>
                  <p className={styles}>Prime balance</p>
                  <h3>{formatToTwoDecimalPlaces(user.tokenBalance)} Prime</h3>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.left__bottom}>
            <span>Last 30 Days</span>
            <div className={styles.history}>
              <div className={styles.history__details}>
                <h4>Transactions</h4>
                <h2>{user.transactions.length}</h2>
              </div>
              <div className={styles.dividing__line}></div>
              <div className={styles.history__details}>
                <h4>Spending</h4>
                <h2>10hvn</h2>
              </div>
              <div className={styles.dividing__line}></div>
              <div className={styles.history__details}>
                <h4>Earnings</h4>
                <h2>30 pri</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <h3>Swap Tokens</h3>
          <div
            className={styles.switch__icon__container}
            onClick={handleSwitch}
          >
            <div className={styles.switch__icon}>
              <Image src={icons.change} alt="icon" fill />
            </div>
          </div>
          <div className={styles.swap__inputs}>
            {coin === "fil" ? (
              <div className={styles.input__box}>
                <input
                  type="number"
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
                <div className={styles.token__symbol}>fil</div>
              </div>
            ) : (
              <div className={styles.input__box}>
                <input
                  type="number"
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
                <div className={styles.token__symbol}>pri</div>
              </div>
            )}
            <div className={styles.arrow}>
              <Image src={icons.arrowDown} alt="icon" fill />
            </div>
            {coin === "fil" ? (
              <div className={styles.input__box}>
                <input
                  type="number"
                  value={swapAmount * 1000}
                  readOnly={true}
                />
                <div className={styles.token__symbol}>pri</div>
              </div>
            ) : (
              <div className={styles.input__box}>
                <input
                  type="number"
                  value={swapAmount / 1000}
                  readOnly={true}
                />
                <div className={styles.token__symbol}>fil</div>
              </div>
            )}
          </div>
          <button className={styles.swap__button} onClick={handleSwap}>
            Swap Tokens
          </button>
          <p>Swap your tokens at any time free of charge</p>
        </div>
      </div>
      <div className={styles.bottom__section}>
        <h2>Transactions</h2>
        <Table data={user.transactions} />
      </div>
      {succes && <SuccesModal text={succesText} />}
    </section>
  );
}

// const data = [
//   { type: "support", date: "octorber 1st", amount: "50 pri", coin: "fil" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "fil" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "fil" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
//   { type: "support", date: "octorber 1st", amount: "50 hvn", coin: "xdc" },
// ];
