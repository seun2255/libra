"use client";

import Image from "next/image";
import styles from "./createCommunity.module.css";
import icons from "@/app/_assets/icons/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createCommunity } from "@/app/api";
import { joinCommunity } from "@/app/database";
import { getAllCommunities } from "@/app/tableland";
import SuccesModal from "@/app/_modals/succedModal";
import { ThreeDots } from "react-loader-spinner";
import { timeStamp } from "@/app/utils/dateFunctions";

export default function CreateCommunity(props) {
  const { setModal } = props;
  const { user } = useSelector((state) => state.user);
  const [fee, setFee] = useState(5);
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    setLoading(true);
    createCommunity(title, description, fee).then(async () => {
      console.log("Got here");
      setTimeout(async () => {
        const communities = await getAllCommunities();
        console.log(communities);
        const newCommunity = communities.length + 1;
        console.log(newCommunity);
        joinCommunity(user.address, newCommunity).then(() => {
          setSucces(true);
          setLoading(false);
          setTimeout(() => {
            setSucces(false);
            setModal(false);
          }, 4000);
        });
      }, 4000);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.close} onClick={() => setModal(false)}>
          <Image src={icons.cancel} alt="cancel icon" fill />
        </div>
        <h3 className={styles.title}>Create a Community</h3>
        <p className={styles.extra}>
          A community can be for the purpose of bringing together content on a
          genre/topic/fandom or just a nice place for family/freinds to keep all
          their content
        </p>

        <div className={styles.input__box}>
          <h3>Title</h3>
          <input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A descriptive title works best"
          />
        </div>
        <div className={styles.input__box}>
          <h3>Description</h3>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Whats your community about"
          />
        </div>

        <div className={styles.fee__box}>
          <h3>Membership Fee (PRI): </h3>
          <input
            type="number"
            className={styles.custom__input}
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        <p className={styles.tip__details}>
          It's best to make tour community free till it gains more popularity
        </p>
        <button className={styles.send__button} onClick={handleCreate}>
          {loading ? (
            <ThreeDots
              height="50%"
              width="100px"
              color="#ffffff"
              visible={true}
            />
          ) : (
            "create Community"
          )}
        </button>
      </div>
      {succes && <SuccesModal text={"Community Created"} />}
    </div>
  );
}
