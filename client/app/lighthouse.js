import lighthouse from "@lighthouse-web3/sdk";
import { getSigner } from "./api";
import axios from "axios";

const registerWorker = async (cid) => {
  const formData = new FormData();
  const requestReceivedTime = new Date();
  const endDate = requestReceivedTime.setMonth(
    requestReceivedTime.getMonth() + 1
  );
  const replicationTarget = 2;
  const epochs = 4; // how many epochs before deal end should deal be renewed
  formData.append("cid", cid);
  formData.append("endDate", endDate);
  formData.append("replicationTarget", replicationTarget);
  formData.append("epochs", epochs);

  const response = await axios.post(
    `https://calibration.lighthouse.storage/api/register_job`,
    formData
  );
  console.log(response.data);
};

const uploadToLighthouse = async (file, progessCallback) => {
  const dealParams = {
    num_copies: 2,
    repair_threshold: 28800,
    renew_threshold: 240,
    miner: ["t017840"],
    network: "calibration",
    add_mock_data: 2,
  };

  const uploadResponse = await lighthouse.upload(
    file,
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    false,
    dealParams,
    progessCallback
  );
  await registerWorker(uploadResponse.data.Hash);
  console.log(uploadResponse.data.Hash);
  return uploadResponse.data.Hash;
};

const uploadEncryptedFile = async (file, progressCallback) => {
  const signer = await getSigner();
  const address = signer.address;
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);

  const dealParams = {
    num_copies: 2,
    repair_threshold: 28800,
    renew_threshold: 240,
    miner: ["t017840"],
    network: "calibration",
    add_mock_data: 2,
  };

  const response = await lighthouse.uploadEncrypted(
    file,
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    address,
    signedMessage,
    dealParams,
    progressCallback
  );
  const { Hash } = response.data[0];
  await registerWorker(Hash);
  return Hash;
};

const applyAccessControl = async (hash) => {
  const signer = await getSigner();
  const address = signer.address;
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);

  const conditions = [
    {
      id: 1,
      chain: "Mumbai",
      method: "hasAccess",
      standardContractType: "Custom",
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [":_id"],
      inputArrayType: ["uint256"],
      outputType: "bool",
    },
  ];
  const aggregator = "([1])";

  const accessResponse = await lighthouse.applyAccessCondition(
    address,
    "QmbcMGabRtkgeQ6JNSJBLFLE44iHoBfV88tqT2pWnSFyDN",
    signedMessage,
    conditions,
    aggregator
  );

  return accessResponse.data.cid;
};

const applyAccessControlCommunity = async (hash, contract) => {
  const signer = await getSigner();
  const address = signer.address;
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);

  const conditions = [
    {
      id: 1,
      chain: "Calibration",
      method: "isMember",
      standardContractType: "Custom",
      contractAddress: contract,
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [],
      inputArrayType: [],
      outputType: "bool",
    },
  ];
  const aggregator = "([1])";

  const accessResponse = await lighthouse.applyAccessCondition(
    address,
    hash,
    signedMessage,
    conditions,
    aggregator
  );

  return accessResponse.data.cid;
};

const decryptFile = async (hash, fileType) => {
  const signer = await getSigner();
  const address = signer.address;
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);

  const keyObject = await lighthouse.fetchEncryptionKey(
    hash,
    address,
    signedMessage
  );

  const decrypted = await lighthouse.decryptFile(
    hash,
    keyObject.data.key,
    fileType
  );
  const url = URL.createObjectURL(decrypted);
  console.log(url);

  return url;
};

const getDeal = async (cid) => {
  let response = await axios.get(
    `https://api.lighthouse.storage/api/lighthouse/get_proof?cid=${cid}&network=testnet`
  );
  return response.data;
};

export {
  uploadToLighthouse,
  uploadEncryptedFile,
  applyAccessControl,
  applyAccessControlCommunity,
  decryptFile,
  getDeal,
};
