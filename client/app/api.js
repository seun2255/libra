import { ethers } from "ethers";
import CONTRACT from "../contracts/Libra.json";
import TOKENCONTRACT from "../contracts/Prime.json";
import COMMUNITYCONTRACT from "../contracts/Community.json";
import {
  uploadNewVideo,
  getUserDetails,
  getUserData,
  createRequest,
} from "./database";
import { Database } from "@tableland/sdk";
import { fileUploadTime } from "./utils/dateFunctions";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID;

/**
 * Blockchain Integration
 */

const getSigner = async () => {
  // const provider = new ethers.providers.JsonRpcProvider({
  //   url: "https://rpc.apothem.network",
  // });

  // if (window.ethereum) {
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     console.log("here 1");
  //     await provider.send("eth_requestAccounts", []);
  //     console.log("here 2");
  //     const signer = provider.getSigner();
  //     console.log("here 3");
  //     return signer;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // } else {
  //   console.error("BlocksPay is not detected in the browser");
  // }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log("here 1");
  // const signer = provider.getSigner();
  // return signer;

  if (window.ethereum) {
    // window.ethereum.request({
    //   method: "wallet_addEthereumChain",
    //   params: [
    //     {
    //       chainId: "0x5",
    //       rpcUrls: [`https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`], // Replace 'YOUR_INFURA_PROJECT_ID' with your Infura project ID
    //       chainName: "Goerli Testnet",
    //       nativeCurrency: {
    //         name: "Ether",
    //         symbol: "ETH",
    //         decimals: 18,
    //       },
    //       blockExplorerUrls: ["https://goerli.etherscan.io/"],
    //     },
    //   ],
    // });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  } else {
    console.log("Wallet not detected.");
  }
};

const getAddress = async () => {
  const signer = await getSigner();
  return signer.address;
};

const getContract = async () => {
  const signer = await getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    CONTRACT.abi,
    signer
  );
  return contract;
};

const getCommunityContract = async (contractAddress) => {
  const signer = await getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    COMMUNITYCONTRACT.abi,
    signer
  );
  return contract;
};

const getTokenContract = async () => {
  const signer = await getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
    TOKENCONTRACT.abi,
    signer
  );
  return contract;
};

// const connect = async () => {
//   var data;
//   const address = await getAddress();
//   data = await getUserData(address);
//   return data;
// };

/**
 * Main Functions
 */

const uploadFile = async (
  title,
  description,
  type,
  url,
  hash,
  tags,
  access,
  cost
) => {
  const contract = await getContract();

  const costAmount = ethers.parseEther(cost.toString());

  const currentDate = new Date();
  const createdAt = fileUploadTime(currentDate);

  let txn = await contract.uploadFile(
    title,
    description,
    type,
    url,
    hash,
    tags,
    access,
    cost.toString(),
    createdAt,
    costAmount
  );
  await txn.wait();
};

/**
 * Transaction Functions
 */

const getBalances = async (address) => {
  const contract = await getTokenContract();

  var ethBalance = await contract.getEthBalance();
  const ethBalanceWei = ethBalance.toString(); // Convert BigNumber to string

  const ethBalanceEther = ethers.formatEther(ethBalanceWei);

  const tokenBalance = await contract.balanceOf(address);
  const tokenBalanceWei = tokenBalance.toString(); // Convert BigNumber to string

  const tokenBalanceEther = ethers.formatEther(tokenBalanceWei);

  return {
    tokenBalanceEther,
    ethBalanceEther,
  };
};

const buyTokens = async (amount) => {
  const contract = await getTokenContract();

  const etherAmount = ethers.parseEther(amount);

  // Call the function and pass Ether
  const tx = await contract.buyTokens({ value: etherAmount });

  // Wait for the transaction to be mined
  await tx.wait();
};

const sellTokens = async (amount) => {
  const contract = await getTokenContract();

  const tokenAmount = ethers.parseEther(amount);

  const tx = await contract.sellTokens(tokenAmount);

  await tx.wait();
};

const sendMatic = async (address, amount) => {
  const signer = await getSigner();

  const amountInWei = ethers.parseEther(amount.toString());

  const transaction = await signer.sendTransaction({
    to: address,
    value: amountInWei,
  });

  // Wait for the transaction to be confirmed
  const receipt = await transaction.wait();
};

const sendPrime = async (address, amount) => {
  const contract = await getTokenContract();

  const tokenAmount = ethers.parseEther(amount.toString());

  const tx = await contract.transfer(address, tokenAmount);

  await tx.wait();
};

const confirmAccess = async (fileId) => {
  const contract = await getContract();

  const allowed = await contract.hasAccess(fileId);
  return allowed;
};

const payForAccess = async (fileId, cost) => {
  const tokenContract = await getTokenContract();
  const contract = await getContract();

  const costAmount = ethers.parseEther(cost.toString());

  const approvalTx = await tokenContract.approve(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    costAmount
  );

  await approvalTx.wait();

  const payementTx = await contract.payForAccess(fileId);

  await payementTx.wait();

  return true;
};

// const makeRequest = async (requestDetails, coin) => {
//   const contract = await getTokenContract();
//   const address = await getAddress();
//   const signer = await getSigner();

//   const rewardAmount = ethers.parseEther(requestDetails.reward.toString());

//   if (coin === "xdc") {
//     const transaction = await signer.sendTransaction({
//       to: address,
//       value: rewardAmount,
//     });
//     await transaction.wait();
//   } else {
//     const transaction = await contract.transfer(
//       process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//       rewardAmount
//     );
//     await transaction.wait();
//   }

//   createRequest(requestDetails, address).then(() => {
//     console.log("request created");
//   });
// };

const createCommunity = async (title, description, cost) => {
  const contract = await getContract();

  const costAmount = ethers.parseEther(cost.toString());

  let txn = await contract.createCommunity(
    title,
    description,
    cost.toString(),
    costAmount
  );
  await txn.wait();
};

const isCommunityMember = async (contractAddress) => {
  const contract = await getCommunityContract(contractAddress);

  const isMember = await contract.isMember();
  return isMember;
};

const joinCommunity = async (contractAddress) => {
  const contract = await getCommunityContract(contractAddress);

  let txn = await contract.joinCommunity();
  await txn.wait();
};

const uploadFileCommunity = async (
  title,
  description,
  type,
  url,
  hash,
  tags,
  contractAddress
) => {
  const contract = await getCommunityContract(contractAddress);

  const currentDate = new Date();
  const createdAt = fileUploadTime(currentDate);

  let txn = await contract.uploadFile(
    title,
    description,
    type,
    url,
    hash,
    tags,
    createdAt
  );
  await txn.wait();
};

const getTable = async () => {
  const signer = await getSigner();

  const tableland = new Database({ signer });
  return tableland;
};

export {
  uploadFile,
  buyTokens,
  sellTokens,
  getBalances,
  sendFil,
  sendPrime,
  confirmAccess,
  payForAccess,
  getTable,
  getSigner,
  getAddress,
  createCommunity,
  joinCommunity,
  isCommunityMember,
  uploadFileCommunity,
};
