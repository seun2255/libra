"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import icons from "@/app/_assets/icons/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWalletModal } from "../redux/modals";
import ConnectButton from "./connectButton";
// import { getSigner } from "../api";
import searchFiles from "../utils/search";

export default function Navbar() {
  const { connected, user } = useSelector((state) => state.user);
  const [results, setResults] = useState([]);
  const [searchModal, setSearchModal] = useState(false);

  const dispatch = useDispatch();

  // const handleSearch = (text) => {
  //   console.log(text);
  //   const searchResults = searchFiles(videos, text);
  //   setResults(searchResults);
  //   if (text !== "") {
  //     setSearchModal(true);
  //   } else {
  //     setSearchModal(false);
  //   }
  // };

  return (
    <div
      className={styles.container}
      onMouseLeave={() => setSearchModal(false)}
    >
      <div className={styles.search__bar}>
        <input
          type="search"
          className={styles.search__input}
          placeholder="Search...."
          // onChange={(e) => handleSearch(e.target.value)}
        />
        <div className={styles.search__icon}>
          <Image alt="searh" fill src={icons.search} />
        </div>
        {searchModal && (
          <div className={styles.search__results}>
            {results.map((item) => {
              return (
                <Link href={`/videos/${item.id}`}>
                  <div
                    className={styles.search__item}
                    onClick={() => setSearchModal(false)}
                  >
                    <h3>{item.title}</h3>
                    <span>{item.author}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {connected ? (
        <div className={styles.name__card}>
          <div className={styles.profile__pic}>
            <Image
              alt="user"
              fill
              src={user.profilePic === "" ? icons.profile : user.profilePic}
            />
          </div>
          <span className={styles.username}>{user.username}</span>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
