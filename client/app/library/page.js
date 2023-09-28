"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FallingLines } from "react-loader-spinner";
import { getAllFiles } from "../tableland";
import icons from "../_assets/icons/icons";
import FileItem from "../_components/fileItem";
import FileDetails from "../_components/fileDetails";
import FileViewModal from "../_modals/fileViewModal";
import FileDeal from "../_modals/fileDeal";

export default function Library() {
  const { fileModal, dealModal } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [displayedFiles, setDisplayedFiles] = useState();
  const [displayGrid, setDisplayGrid] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [showFileDetails, setShowFileDetails] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadFiles = async () => {
      console.log("Clicked");
      const results = await getAllFiles();
      setFiles(results);
      console.log(results);
      setDisplayedFiles(results);
      setLoading(false);
    };

    loadFiles();
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setShowFileDetails(true);
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
          <div className={styles.files}>
            <div className={styles.top__items}>
              <h3 className={styles.header}>Library</h3>
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
            </div>
            <div className={styles.file__grid}>
              {displayedFiles.map((file, id) => {
                return (
                  <FileItem key={id} file={file} select={handleFileSelect} />
                );
              })}
            </div>
          </div>
          {dealModal && <FileDeal cid={selectedFile.hash} />}
          {showFileDetails && <FileDetails file={selectedFile} />}
          {fileModal && <FileViewModal />}
        </div>
      )}
    </div>
  );
}
