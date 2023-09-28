import app from "@/firebase/firebaseApp";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { timeStamp } from "./utils/dateFunctions";
import { getAllCommunities } from "./tableland";
// import { getTokenBalance } from "./api";

const db = getFirestore(app);

/**
 * Auth Functions
 */

//Checks if the User exists in the database
const checkIfUserExists = async (user) => {
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    data[doc.id] = doc.data();
  });
  var state = false;
  const addresses = Object.keys(data);
  addresses.map((address) => {
    if (address === user) state = true;
  });
  return state;
};

//creates a new User
const createUser = async (address) => {
  const user = {
    username: "user",
    about: "",
    profilePic: "",
    banner: "",
    communities: [],
    address: address,
    transactions: [],
  };
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data[doc.id] = doc.data();
  });
  if (data[address]) {
    console.log("User already registered");
  } else {
    await setDoc(doc(db, "users", address), user);
  }
};

//updates a users data
const updateUserProfile = async (
  username,
  about,
  profilePic,
  banner,
  address
) => {
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data[doc.id] = doc.data();
  });
  console.log(address);
  var temp = data[address];
  console.log(temp);
  temp.about = about;
  temp.username = username;
  temp.profilePic = profilePic;
  await setDoc(doc(db, "users", address), temp);
};

//gets a users data
const getUserDetails = async (address) => {
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data[doc.id] = doc.data();
  });
  const details = data[address];
  // const balances = await getTokenBalance(address);
  // details.balance = balances.ethBalanceEther;
  // details.tokenBalance = balances.tokenBalanceEther;
  return details;
};

const joinCommunity = async (address, communityId) => {
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data[doc.id] = doc.data();
  });
  const user = data[address];
  console.log(user);
  // user.communities.push(communityId);
  // await setDoc(doc(db, "users", address), user);
};

const recordTransaction = async (address, details) => {
  var data = {};
  const userData = await getDocs(collection(db, "users"));
  userData.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data[doc.id] = doc.data();
  });
  const user = data[address];
  user.transactions.unshift(details);
  await setDoc(doc(db, "users", address), user);
};

export {
  updateUserProfile,
  checkIfUserExists,
  getUserDetails,
  db,
  joinCommunity,
  recordTransaction,
  createUser,
};
