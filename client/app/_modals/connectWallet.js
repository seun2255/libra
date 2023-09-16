import { animated, useSpring } from "@react-spring/web";
import styles from "./connectWallet.module.css";
import { useDispatch } from "react-redux";
import { setWalletModal } from "@/app/redux/modals";
import { login, updateUser } from "@/app/redux/user";
import { setNewUserModal } from "@/app/redux/modals";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
// import { connect } from "@/app/api";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db, getAllVideos } from "../database";
// import { getUserDetails } from "../database";

export default function ConnectWallet() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // const handleArConnect = async () => {
  //   const { user, videos } = await arconnect();
  //   dispatch(login(user));
  //   dispatch(updateVideos(videos));
  //   dispatch(setWalletModal(false));
  // };

  // const handleConnect = async () => {
  //   connect().then((data) => {
  //     console.log("Logging in");
  //     dispatch(login(data.data));
  //     dispatch(updateVideos(data.videos));
  //     dispatch(setWalletModal(false));
  //     setTimeout(() => {
  //       if (data.new) dispatch(setNewUserModal(true));
  //     }, 2000);
  //     const unsubUser = onSnapshot(
  //       doc(db, "users", data.data.address),
  //       (doc) => {
  //         getUserDetails(data.data.address).then((data) => {
  //           dispatch(updateUser(data));
  //         });
  //       }
  //     );
  //     const unsubSchools = onSnapshot(doc(db, "content", "videos"), (doc) => {
  //       getAllVideos().then((videos) => {
  //         dispatch(updateVideos(videos));
  //       });
  //     });
  //   });
  // };

  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    top: open ? "0px" : "200px",
    config: { duration: 150 },
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div
      className={styles.outer}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setWalletModal(false));
      }}
    >
      <animated.div
        className={styles.container}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setWalletModal(true));
        }}
      >
        {loading ? (
          <ThreeDots
            height="70%"
            width="100%"
            color="#597dffb7"
            visible={true}
          />
        ) : (
          <div className={styles.options}>
            <h2 className={styles.title}>Connect Wallet</h2>
            <p className={styles.details}>
              In order to view and create content you need to connect to your
              wallet <br /> Libra supports connection with dataverseos
            </p>
            <div className={styles.buttons}>
              <button className={styles.button}>Metamask</button>
              {/* <button className={styles.button} onClick={handleArConnect}>
                Arconnect
              </button> */}
            </div>
          </div>
        )}
      </animated.div>
    </div>
  );
}
