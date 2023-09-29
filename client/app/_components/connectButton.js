"use client";

import {
  DataverseConnector,
  RESOURCE,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, updateUser } from "../redux/user";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../database";
import { getBalances } from "../api";
import styles from "./connectButton.module.css";
import { checkIfUserExists, createUser, getUserDetails } from "../database";
import { dataverseConnector } from "../dataverse";

export default function ConnectButton() {
  const [wallet, setWallet] = useState();
  const dispatch = useDispatch();

  const createCapability = async () => {
    const pkh = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createCapability,
      params: {
        appId: process.env.NEXT_PUBLIC_DATAVERSE_APP_ID,
        resource: RESOURCE.CERAMIC,
        wallet,
      },
    });
  };

  const connectWallet = async () => {
    try {
      const res = await dataverseConnector.connectWallet();
      console.log(res.address);
      setWallet(res.wallet);
      await createCapability();
      checkIfUserExists(res.address).then(async (exists) => {
        if (exists) {
          const user = await getUserDetails(res.address);
          const { tokenBalanceEther, ethBalanceEther } = await getBalances(
            res.address
          );
          user.balance = ethBalanceEther;
          user.tokenBalance = tokenBalanceEther;
          dispatch(login(user));
        } else {
          await createUser(res.address);
          const user = await getUserDetails(res.address);
          const { tokenBalanceEther, ethBalanceEther } = await getBalances(
            res.address
          );
          user.balance = ethBalanceEther;
          user.tokenBalance = tokenBalanceEther;
          dispatch(login(user));
        }
        const unsubUser = onSnapshot(
          doc(db, "users", res.address.toLowerCase()),
          (doc) => {
            getUserDetails(res.address.toLowerCase()).then(async (data) => {
              const { tokenBalanceEther, ethBalanceEther } = await getBalances(
                res.address
              );
              const user = data;
              user.balance = ethBalanceEther;
              user.tokenBalance = tokenBalanceEther;
              dispatch(updateUser(user));
            });
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={connectWallet} className={styles.connect__button}>
        Connect Wallet
      </button>
    </>
  );
}
