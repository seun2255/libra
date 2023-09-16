"use client";

import Image from "next/image";
import SideBar from "./_components/sideBar";
import Navbar from "./_components/navbar";
import styles from "./layout.module.css";
import NewUser from "./_modals/newUser";
import ConnectWallet from "./_modals/connectWallet";
import icons from "./_assets/icons/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWalletModal } from "./redux/modals";
import ConnectButton from "./_components/connectButton";

export default function Wrapper({ children }) {
  const [newUserModal, setNewUserModal] = useState(false);
  const { walletModal } = useSelector((state) => state.modals);
  const { connected, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.content}>
        <Navbar />
        {connected ? (
          children
        ) : (
          <div className={styles.not__connected}>
            <div className={styles.lock__icon}>
              <Image src={icons.lock} alt="lock icon" fill />
            </div>
            <ConnectButton />
          </div>
        )}
      </div>

      {newUserModal && <NewUser />}
      {walletModal && <ConnectWallet />}
    </div>
  );
}
