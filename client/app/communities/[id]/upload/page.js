"use client";

import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/app/_assets/icons/icons";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import linkCreator from "@/app/utils/linkCreator";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import ProgressModal from "./progressModal";
import arrayToString from "@/app/utils/arrayToString";
import fileType from "@/app/utils/fileType";
import fileExtension from "@/app/utils/fileExtension";
import { getCommunity } from "@/app/tableland";
import { uploadFileCommunity } from "@/app/api";
import { isCommunityMember } from "@/app/api";
import {
  uploadToLighthouse,
  uploadEncryptedFile,
  applyAccessControlCommunity,
} from "@/app/lighthouse";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescriptionn] = useState("");
  const [file, setFile] = useState(false);
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadModal, setUploadModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState(0);
  const [cost, setCost] = useState(0);
  const [upload, setUpload] = useState();
  const [uploading, setUploading] = useState(false);
  const [extension, setExtension] = useState("");
  const [encrypting, setEncrypting] = useState(false);
  const [data, setData] = useState({});
  const pathname = usePathname();
  console.log(pathname);

  const { user } = useSelector((state) => state.user);

  const router = useRouter();

  function extractNumberFromRoute(route) {
    const segments = route.split("/");
    const index = segments.indexOf("communities");

    if (index !== -1 && index + 1 < segments.length) {
      return segments[index + 1];
    }

    // Handle the case where "communities" is not found or there's no number after it.
    return null;
  }

  const loadCommunity = async () => {
    const id = extractNumberFromRoute(pathname);
    const community = await getCommunity(id);
    setData(community);
    console.log(community);
  };

  useEffect(() => {
    loadCommunity();
  }, []);

  const mimeType = () => {
    return `${type}/${extension}`;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    var file;
    acceptedFiles.forEach((item) => {
      file = item;
    });
    setType(fileType(file));
    console.log(fileExtension(file));
    setExtension(fileExtension(file));
    setFile(file);
    setUpload(acceptedFiles);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handelCancel = () => {
    setFile(false);
  };

  const addTag = (tagIndex) => {
    const addedTags = [...tags];
    const newTag = availableTags[tagIndex];
    addedTags.push(newTag);
    availableTags.splice(tagIndex, 1);

    setTags(addedTags);
  };

  const removeTag = (tagIndex) => {
    const addedTags = [...tags];
    const removedTag = tags[tagIndex];
    availableTags.push(removedTag);
    addedTags.splice(tagIndex, 1);

    setTags(addedTags);
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadModal(true);

    const progressCallback = (progressData) => {
      let percentageDone =
        100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
      if (percentageDone >= 99) percentageDone = 100;
      setProgress(percentageDone);
    };

    const secureUpload = async () => {
      const hash = await uploadEncryptedFile(upload, progressCallback);
      setUploading(false);
      setEncrypting(true);
      const cid = await applyAccessControlCommunity(hash, data.contract);
      setEncrypting(false);
      return cid;
    };

    const hash = await secureUpload();

    const link = linkCreator(hash);
    setUploading(false);
    console.log("file Link: ", link);
    console.log("file hash: ", hash);

    uploadFileCommunity(
      title,
      description,
      mimeType(),
      link,
      hash,
      arrayToString(tags),
      data.contract
    ).then(() => {
      setSaved(true);
      router.back();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.top__buttons}>
          <h2 className={styles.title}>Upload Video</h2>
          <button className={styles.clear__button}>Clear</button>
        </div>
        <div
          className={styles.upload__box}
          {...getRootProps()}
          style={{ borderColor: isDragActive ? "#8e96d2" : "#747c87" }}
        >
          <input {...getInputProps()} />
          <div className={styles.upload__icon}>
            <Image src={icons.upload} alt="upload icon" fill id="input" />
          </div>
          <p className={styles.upload__help}>
            Drag & Drop or <label htmlFor="input">Choose file</label> to upload
          </p>
          <p className={styles.accepted__types}>Mp4 or Hmv</p>
        </div>
        {file && (
          <div className={styles.file__uploaded}>
            <div className={styles.file__info}>
              <div className={styles.file__icon__outer}>
                <div className={styles.file__icon}>
                  <Image src={icons.file} alt="icon" fill />
                </div>
              </div>
              <div className={styles.file__details}>
                <p className={styles.file__name}>{file.name}</p>
                <p className={styles.file__size}>
                  {(file.size / (1024 * 1024)).toFixed(2)} mb
                </p>
              </div>
            </div>
            <div className={styles.upload__progress}>
              <div className={styles.cancel__icon} onClick={handelCancel}>
                <Image src={icons.cancel} alt="cancel icon" fill />
              </div>
            </div>
          </div>
        )}
        <div className={styles.input__box}>
          <h3>Title</h3>
          <input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A descriptive title works best"
          />
        </div>
        <div className={styles.input__box}>
          <h3>Description</h3>
          <input
            onChange={(e) => setDescriptionn(e.target.value)}
            placeholder="Whats your content about"
          />
        </div>
        <div className={styles.input__box}>
          <h3>Tags</h3>
          <div className={styles.tags}>
            {tags.map((tag, id) => {
              return (
                <Tag
                  text={tag}
                  selected={true}
                  key={id}
                  removeTag={() => removeTag(id)}
                />
              );
            })}
          </div>
          <div className={styles.available__tags}>
            {availableTags.map((tag, id) => {
              return (
                <Tag
                  text={tag}
                  selected={false}
                  key={id}
                  addTag={() => addTag(id)}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.upload__button} onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {uploadModal && (
        <ProgressModal
          setModal={setUploadModal}
          loading={saved}
          progress={progress}
          uploading={uploading}
          encrypting={encrypting}
        />
      )}
    </div>
  );
}

function Tag(props) {
  const { selected, text, removeTag, addTag } = props;

  return (
    <>
      {selected ? (
        <button
          className={styles.tag}
          onClick={() => removeTag()}
          style={{ backgroundColor: "#bfe2d2" }}
        >
          {text}
          <div className={styles.cross__tag__icon}>
            <Image src={icons.plus} alt="cancel icon" fill />
          </div>
        </button>
      ) : (
        <button className={styles.tag} onClick={() => addTag()}>
          <div className={styles.tag__icon}>
            <Image src={icons.plus} alt="cancel icon" fill />
          </div>
          {text}
        </button>
      )}
    </>
  );
}

var availableTags = [
  "music",
  "education",
  "tech",
  "software",
  "history",
  "games",
  "anime",
  "DIY",
  "dance",
  "sport",
  "cartoon",
  "vlog",
  "science",
];

const staticTags = [
  "music",
  "education",
  "tech",
  "software",
  "history",
  "games",
  "anime",
  "DIY",
  "dance",
  "sport",
  "cartoon",
  "vlog",
  "science",
];

const privacy = ["public", "private"];

// const video = document.createElement("video");

//     video.preload = "metadata";
//     video.src = URL.createObjectURL(uploadedFile);

//     video.onloadedmetadata = function () {
//       const videoDuration = video.duration;
//       console.log("Video Duration:", formatTime(videoDuration));
//       setDuration(formatTime(videoDuration));
//     };
