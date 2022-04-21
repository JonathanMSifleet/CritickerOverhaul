const ROOT = 'https://fl6lwlunp9.execute-api.eu-west-2.amazonaws.com/dev';

const ADD_ACCOUNTS = `${ROOT}/mockData/addAccounts`;
const AGGREGATE_PERCENTILES = `${ROOT}/mockData/aggregateUserPercentiles`;
const GENERATE_TCI = `${ROOT}/user/generateTCI`;
const IMPORT_AVATARS = `${ROOT}/mockData/importAvatars`;
const IMPORT_GENERATED_RATINGS = `${ROOT}/mockData/importGeneratedRatings`;
const UPDATE_NUM_RATINGS = `${ROOT}/mockData/importGeneratedRatings`;
const UPDATE_PERCENTILES = `${ROOT}/mockData/updatePercentiles`;

module.exports = {
  ADD_ACCOUNTS,
  AGGREGATE_PERCENTILES,
  GENERATE_TCI,
  IMPORT_AVATARS,
  IMPORT_GENERATED_RATINGS,
  UPDATE_NUM_RATINGS,
  UPDATE_PERCENTILES
}