import lighthouse from "@lighthouse-web3/sdk";
import { getSigner } from "./api";

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
      chain: "Mumbai",
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

const decryptFile = async (hash) => {
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

  const fileType = "video/mp4";
  const decrypted = await lighthouse.decryptFile(
    hash,
    keyObject.data.key,
    fileType
  );
  const url = URL.createObjectURL(decrypted);
  console.log(url);

  return url;
};

export {
  uploadToLighthouse,
  uploadEncryptedFile,
  applyAccessControl,
  applyAccessControlCommunity,
  decryptFile,
};
