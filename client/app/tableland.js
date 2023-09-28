import { Database } from "@tableland/sdk";

// const fileTableName = "libra_31337_2";
// const communitiesTableName = "libra_communities_31337_3";

const fileTableName = "libra_80001_7661";
const communitiesTableName = "libra_communities_80001_7662";

const getAllFiles = async () => {
  const db = new Database();
  const { results } = await db.prepare(`SELECT * FROM ${fileTableName};`).all();
  return results;
};

const getAllCommunities = async () => {
  const db = new Database();
  const { results } = await db
    .prepare(`SELECT * FROM ${communitiesTableName};`)
    .all();
  return results;
};

const getMyFiles = async (userAddress) => {
  const db = new Database();
  const address = userAddress.toString();
  console.log(address.toLowerCase());
  const { results } = await db
    .prepare(
      `SELECT * FROM ${fileTableName} WHERE address = "${address.toLowerCase()}";`
    )
    .all();
  console.log(results);
  return results;
};

const getCommunity = async (id) => {
  var data;
  const db = new Database();
  const community = await db
    .prepare(`SELECT * FROM ${communitiesTableName} WHERE id = "${id}";`)
    .all();
  const tableName = community.results[0].files;
  console.log(tableName);

  const communityFiles = await db.prepare(`SELECT * FROM ${tableName};`).all();
  console.log(communityFiles.results);
  data = community.results[0];
  data.files = communityFiles.results;
  return data;
};

export { getAllFiles, getMyFiles, getAllCommunities, getCommunity };

//const fileTableName = "libra_80001_7556"; mumbai test
