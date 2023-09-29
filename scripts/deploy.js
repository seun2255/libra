const { ethers } = require("hardhat");

async function main() {
  //Deploy the Token Contract
  const Prime = await ethers.getContractFactory("Prime");
  const myToken = await Prime.deploy({ gasLimit: 90000000 });
  await myToken.waitForDeployment();

  console.log("Token Successfully Deployed!");
  const tokenContract = await myToken.getAddress();
  console.log("Token address:", tokenContract);

  // Deploy the RowController contract
  const RowController = await ethers.getContractFactory("RowController");
  const rowController = await RowController.deploy({ gasLimit: 90000000 });
  await rowController.waitForDeployment();
  const rowControllerAddress = await rowController.getAddress();
  console.log("RowController address:", rowControllerAddress);

  // Deploy the Main contract
  const Libra = await ethers.getContractFactory("Libra");
  const libraContract = await Libra.deploy(
    tokenContract,
    rowControllerAddress,
    { gasLimit: 10000000000 }
  );
  await libraContract.waitForDeployment();
  const libraContractAddress = await libraContract.getAddress();
  console.log("Libra address:", libraContractAddress);

  // Set the Libra contract's table controller to the RowController contract
  let tx = await libraContract.setAccessControl(rowControllerAddress, {
    gasLimit: 10000000000,
  });
  await tx.wait();
  console.log(
    `Libra contract's table controller set to '${rowControllerAddress}'.\n`
  );

  const [owner, other] = await ethers.getSigners();
  const filesTableName = await libraContract.connect(owner).getFilesTableName();
  const communitiesTableName = await libraContract
    .connect(owner)
    .getCommunitiesTableName();
  console.log("Files Table: ", filesTableName);
  console.log("Communities Table: ", communitiesTableName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
