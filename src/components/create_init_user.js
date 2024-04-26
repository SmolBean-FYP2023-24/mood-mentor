import { getUserDataModel } from "../graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";

async function isLoggedIn() {
  try {
    const user = await getCurrentUser();
    return user.userId;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const decideCreateNewEntry = async () => {
  const userResult = await isLoggedIn();
  if (userResult !== false) {
    const client = generateClient();
    const user = await client.graphql({
      query: getUserDataModel,
      variables: {
        username: userResult,
      },
    });
    if (user.data.getUserDataModel !== null) {
      return false; // don't create new entry
    } else {
      return true; // create new entry
    }
  }
};
