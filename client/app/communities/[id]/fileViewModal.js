"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { isCommunityMember } from "@/app/api";
import styles from "./fileViewModal.module.css";
import "video-react/dist/video-react.css";
import { Player, ControlBar } from "video-react";
import { ThreeDots } from "react-loader-spinner";
import { useSpring, animated } from "@react-spring/web";
import { closeFileModal } from "../../redux/modals";
import { useSelector, useDispatch } from "react-redux";
import { decryptFile } from "../../lighthouse";

export default function FileViewModal(props) {
  const { contractAddress } = props;
  const { fileModal, file } = useSelector((state) => state.modals);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  console.log(file);

  function getMimeTypeCategory(mimeType) {
    const slashIndex = mimeType.indexOf("/");
    if (slashIndex !== -1) {
      return mimeType.substring(0, slashIndex);
    } else {
      return mimeType; // Return the full string if there is no slash
    }
  }

  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 150 },
  });

  useEffect(() => {
    setOpen(true);
    isCommunityMember(contractAddress).then((result) => {
      if (result) {
        decryptFile(file.hash, file.type).then((link) => {
          console.log(url);
          setUrl(link);
          setCanAccess(result);
          setLoading(false);
        });
      }
      setCanAccess(result);
      setLoading(false);
    });
  }, []);

  const handlePay = async () => {
    payForAccess(file.id, 10).then(() => {
      console.log("Payed for File");
      setCanAccess(true);
    });
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(closeFileModal());
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {loading ? (
          <ThreeDots
            height="70%"
            width="100%"
            color="#597dffb7"
            visible={true}
          />
        ) : canAccess ? (
          getMimeTypeCategory(file.type) === "video" ? (
            <Video url={url} />
          ) : (
            <Picture url={url} />
          )
        ) : (
          <div className={styles.no__access}>
            <h3>You don't have access to this 🥺</h3>
            <p>gain access by supporting the creator of this content</p>
            <button onClick={handlePay}>Pay {file.cost} HVN fee</button>
          </div>
        )}
      </animated.div>
    </div>
  );
}

const Picture = (props) => {
  const { url } = props;
  return (
    <div className={styles.pic}>
      <Image src={url} alt="image" fill />
    </div>
  );
};

const Video = (props) => {
  const { url } = props;
  return (
    <Player autoPlay src={url} className={styles.player}>
      <ControlBar autoHide={false} className="my-class" />
    </Player>
  );
};
