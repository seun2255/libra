require("dotenv").config();

const lighthouse = require("@lighthouse-web3/sdk");

const uploadFile = async () => {
  const path = "C:/Users/Primal/Pictures/beuty.png";
  const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
  const dealParams = {
    num_copies: 2,
    repair_threshold: 28800,
    renew_threshold: 240,
    miner: ["t017840"],
    network: "calibration",
    add_mock_data: 2,
  };

  const response = await lighthouse.upload(path, apiKey);
  console.log(response);
};

uploadFile();
