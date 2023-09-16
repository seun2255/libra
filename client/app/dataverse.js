import {
  DataverseConnector,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";

const dataverseConnector = new DataverseConnector();

const createDefaultProfile = async () => {
  const res = await dataverseConnector.runOS({
    method: SYSTEM_CALL.createStream,
    params: {
      modelId:
        "kjzl6hvfrbw6c5xy24chmzpu8udsftg69vhi7ht6xd905boj18re24tat3h7n2c",
      streamContent: {
        name: "User",
        about: "",
        image:
          "https://bafybeignovnejiid7cw44lse7764gphel4uln63ng2g42dqzqvtfbxqfyi.ipfs.dweb.link/profile.svg",
        banner:
          "https://bafybeigi5y56rutywjflgs7rciiof7cvrxgh7vid5l7rdydds5xnqwsb6m.ipfs.dweb.link/banner.jpg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });
  return res.streamId;
};

const updateUserProfile = async (streamId, name, about, image, banner) => {
  const date = new Date().toISOString();

  const res = await dataverseConnector.runOS({
    method: SYSTEM_CALL.updateStream,
    params: {
      streamId,
      streamContent: {
        name,
        about,
        image,
        banner,
        createdAt: date,
        updatedAt: date,
      },
    },
  });
};

const loadUserProfile = async (streamId) => {
  const user = await dataverseConnector.runOS({
    method: SYSTEM_CALL.loadStream,
    params: streamId,
  });
  return user;
};

export {
  createDefaultProfile,
  loadUserProfile,
  updateUserProfile,
  dataverseConnector,
};
