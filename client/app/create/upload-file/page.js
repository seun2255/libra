"use client";

import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/app/_assets/icons/icons";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import linkCreator from "@/app/utils/linkCreator";
import { Web3Storage } from "web3.storage";
import { useRouter } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";
import { animated, useSpring } from "@react-spring/web";
import { uploadVideo } from "@/app/api";
import { useSelector } from "react-redux";
import ProgressModal from "./progressModal";
import { formatTime } from "@/app/utils/dateFunctions";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescriptionn] = useState("");
  const [thumbnail, setThumbnail] = useState(false);
  const [thumbnailPic, setThumbnailPic] = useState(false);
  const [video, setVideo] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [videoLoader, setVideoLoader] = useState(false);
  const [tags, setTags] = useState([]);
  const [picLoader, setPicLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedPrivacy, setSelectedPrivacy] = useState(0);
  const [cost, setCost] = useState(0);

  const { user } = useSelector((state) => state.user);

  const router = useRouter();

  const token = process.env.NEXT_PUBLIC_STORAGE_TOKEN;
  const client = new Web3Storage({ token });

  const onDrop = useCallback(async (acceptedFiles) => {
    var uploadedFile;
    acceptedFiles.forEach((file) => {
      uploadedFile = file;
    });

    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = URL.createObjectURL(uploadedFile);

    video.onloadedmetadata = function () {
      const videoDuration = video.duration;
      console.log("Video Duration:", formatTime(videoDuration));
      setDuration(formatTime(videoDuration));
    };
    setVideoLoader(true);
    setVideo(uploadedFile);

    const cid = await client.put(acceptedFiles);
    const url = linkCreator(cid, uploadedFile.name);
    setVideoLink(url);
    setVideoLoader(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleThumbnailUpload = async (event) => {
    setPicLoader(true);
    let file = event.target.files[0];
    if (file) {
      const cid = await client.put(event.target.files);
      const url = linkCreator(cid, file.name);
      setThumbnailPic(url);
      setThumbnail(url);
      setPicLoader(false);
    }
  };

  const handelCancel = () => {
    setVideo(false);
    setVideoLink("");
    setVideoLoader(false);
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

  const selectPrivacy = (id) => {
    setSelectedPrivacy(id);
    if (id === 0) setCost(0);
  };

  const handleUpload = () => {
    setSaving(true);
    uploadVideo(
      title,
      description,
      videoLink,
      thumbnail,
      tags,
      duration,
      privacy[selectedPrivacy],
      cost
    ).then(() => {
      setSaved(true);
    });
  };

  const animateProgress = useSpring({
    width: `${progress}%`,
    config: { duration: 1000 },
  });

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
          style={{ borderColor: isDragActive ? "#3fa77a" : "#747c87" }}
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
        {video && (
          <div className={styles.video__uploaded}>
            <div className={styles.file__icon__outer}>
              <div className={styles.file__icon}>
                <Image src={icons.file} alt="icon" fill />
              </div>
            </div>
            <div className={styles.video__details}>
              <p className={styles.video__name}>{video.name}</p>
              <p className={styles.video__size}>
                {(video.size / (1024 * 1024)).toFixed(2)} mb
              </p>
            </div>
            {videoLoader ? (
              <ThreeDots
                height="16px"
                width="120px"
                color="#3fa77a"
                visible={true}
              />
            ) : (
              <div className={styles.succes}>
                Uploaded{" "}
                <div className={styles.tick}>
                  <Image src={icons.succesTick} alt="succes icon" fill />
                </div>
              </div>
            )}
            <div className={styles.cancel__icon} onClick={handelCancel}>
              <Image src={icons.cancel} alt="cancel icon" fill />
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
        <div className={styles.thumbnail__box}>
          <div className={styles.thumbnail}>
            {picLoader ? (
              <ThreeDots
                height="20%"
                width="80%"
                color="#3c30dd"
                visible={true}
              />
            ) : thumbnailPic ? (
              <Image
                src={thumbnailPic}
                alt="thumbnail"
                fill
                objectFit="cover"
                objectPosition="center"
              />
            ) : (
              <div className={styles.no__thumbnail}>
                <div className={styles.thumbnail__icon}>
                  <Image src={icons.thumbnail} alt="thumbnail" fill />
                </div>
                <p>Upload Thumbnail</p>
              </div>
            )}
          </div>
          <div className={styles.thumbnail__details}>
            <input
              type="file"
              id="thumbnail"
              accept=".jpg, .jpeg, .png"
              style={{ display: "none" }}
              onChange={handleThumbnailUpload}
            />
            <label className={styles.thumbnail__button} htmlFor="thumbnail">
              <div className={styles.text}>Choose an enticing thumbnail</div>
              <button className={styles.browse}>Browse</button>
            </label>
            <p className={styles.new__thumbnail}>Enter new thumbnail</p>
          </div>
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

        <div className={styles.input__box}>
          <h3>Access</h3>
          <div className={styles.token__choice}>
            {privacy.map((item, id) => {
              return (
                <button
                  key={id}
                  style={{
                    borderRadius: id === 0 ? "7px 0 0 7px" : "0 7px 7px 0",
                    backgroundColor:
                      selectedPrivacy === id ? "rgb(4, 122, 219)" : null,
                  }}
                  onClick={() => selectPrivacy(id)}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {selectedPrivacy === 1 && (
            <div className={styles.cost__input}>
              <span>Cost (hvn): </span>
              <input
                type="number"
                className={styles.custom__input}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className={styles.buttons}>
          <button className={styles.upload__button} onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {saving && <ProgressModal loading={saved} />}
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
