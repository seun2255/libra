"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FallingLines } from "react-loader-spinner";
import { getCommunity } from "../../tableland";
import icons from "../../_assets/icons/icons";
import FileItem from "../../_components/fileItem";
import FileDetails from "../../_components/fileDetails";
import FileViewModal from "./fileViewModal";
import images from "@/app/_assets/images/images";
import { isCommunityMember, joinCommunity } from "@/app/api";
import FileDeal from "@/app/_modals/fileDeal";
import { ThreeDots } from "react-loader-spinner";

export default function Community({ params }) {
  const { fileModal, dealModal } = useSelector((state) => state.modals);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [displayedFiles, setDisplayedFiles] = useState();
  const [displayGrid, setDisplayGrid] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  const id = params.id;

  const loadCommunity = async () => {
    const community = await getCommunity(id);
    setData(community);
    console.log(community);
    isCommunityMember(community.contract).then((result) => {
      setIsMember(result);
    });
    setDisplayedFiles(community.files);
    setLoading(false);
  };

  useEffect(() => {
    loadCommunity();
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setShowFileDetails(true);
  };

  const handleClick = () => {
    setJoining(true);
    joinCommunity(data.contract, data.accessfee).then(() => {
      loadCommunity();
      setJoining(false);
    });
  };

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
          <div className={styles.container__inner}>
            <div className={styles.banner}>
              <Image src={images.banner} alt="banner" fill />
              <h3 className={styles.title}>{data.title}</h3>
            </div>
            <div className={styles.files}>
              <div className={styles.top__items}>
                <h3 className={styles.header}>Files</h3>
                <div className={styles.buttons}>
                  <div className={styles.display__mode}>
                    <div
                      className={styles.icon__container}
                      onClick={() => setDisplayGrid(true)}
                      style={{
                        backgroundColor: displayGrid ? "#6a76cb" : null,
                      }}
                    >
                      <div
                        className={styles.icon2}
                        style={{
                          filter: displayGrid
                            ? "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(1%) hue-rotate(96deg) brightness(102%) contrast(102%)"
                            : null,
                        }}
                      >
                        <Image src={icons.grid} alt="icon" fill />
                      </div>
                    </div>
                    <div
                      className={styles.icon__container}
                      onClick={() => setDisplayGrid(false)}
                      style={{
                        backgroundColor: displayGrid ? null : "#6a76cb",
                      }}
                    >
                      <div
                        className={styles.icon}
                        style={{
                          filter: displayGrid
                            ? null
                            : "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(1%) hue-rotate(96deg) brightness(102%) contrast(102%)",
                        }}
                      >
                        <Image src={icons.list} alt="icon" fill />
                      </div>
                    </div>
                  </div>
                  <Link href={`/communities/${data.id}/upload`}>
                    <button className={styles.new__button}>
                      <div className={styles.plus__icon}>
                        <Image src={icons.plus} alt="plus icon" fill />
                      </div>
                      new
                    </button>
                  </Link>
                </div>
              </div>
              <div className={styles.file__grid}>
                {displayedFiles.map((file, id) => {
                  return (
                    <FileItem key={id} file={file} select={handleFileSelect} />
                  );
                })}
              </div>
              {!isMember && (
                <div className={styles.join__outer}>
                  <div className={styles.join}>
                    <h3>You don't have access to this Community 🥺</h3>
                    {data.accessfee !== "0" ? (
                      <p>
                        gain access by paying a {data.accessfee} Pri membership
                        fee
                      </p>
                    ) : null}
                    <button onClick={handleClick}>
                      {joining ? (
                        <ThreeDots
                          height="50%"
                          width="100px"
                          color="#6a76cb"
                          visible={true}
                        />
                      ) : (
                        "Join Community"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {dealModal && <FileDeal cid={selectedFile.hash} />}
          {showFileDetails && <FileDetails file={selectedFile} />}
          {fileModal && <FileViewModal contractAddress={data.contract} />}
        </div>
      )}
    </div>
  );
}
