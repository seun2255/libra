"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import icons from "@/app/_assets/icons/icons";
import Table from "./components/table";
import { getAllCommunities } from "../tableland";
import CreateCommunity from "./components/createCommunity";
import Community from "./components/card";
import { FallingLines } from "react-loader-spinner";

export default function Requests() {
  const [create, setCreate] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [displayedCommunities, setDisplayedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (text) => {};

  useEffect(() => {
    const loadCommunities = async () => {
      const results = await getAllCommunities();
      setCommunities(results);
      console.log(results);
      setDisplayedCommunities(results);
      setLoading(false);
    };

    loadCommunities();
  }, []);

  return (
    <div className={styles.outer}>
      {loading ? (
        <FallingLines
          color="#6a76cb"
          width="600"
          visible={true}
          ariaLabel="falling-lines-loading"
        />
      ) : (
        <div className={styles.container}>
          <h3>Communities</h3>
          <div className={styles.requests}>
            <div className={styles.top}>
              <input
                className={styles.input}
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                className={styles.new__button}
                onClick={() => setCreate(true)}
              >
                <div className={styles.plus__icon}>
                  <Image src={icons.plus} alt="plus icon" fill />
                </div>
                new
              </button>
            </div>

            <div className={styles.file__grid}>
              {displayedCommunities.map((community, id) => {
                return <Community key={id} community={community} />;
              })}
            </div>
          </div>
          {create && <CreateCommunity setModal={setCreate} />}
        </div>
      )}
    </div>
  );
}
