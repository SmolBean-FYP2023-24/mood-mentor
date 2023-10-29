import { Amplify, Auth } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";

import awsExports from "../aws-exports";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

Amplify.configure(awsExports);

function Home() {
  let navigate = useNavigate();

  async function isLoggedIn() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  useEffect(() => {
    console.log("OK");
    const checkUser = async () => {
      try {
        let user = await isLoggedIn();
        console.log(user);
        if (user === false) {
          console.log("You're right");
          return navigate("/login");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkUser();
  });

  return (
    // Commented AWS Part
    // <Authenticator>
    //   {({ signOut, user }) => (
    //     <main>
    //       <h1>Hello {user.username}</h1>
    //       <button onClick={signOut}>Sign out</button>
    //     </main>
    //   )}
    // </Authenticator>
    <></>
  );
}

export default Home;
