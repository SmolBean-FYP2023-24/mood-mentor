import { Auth } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";

import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home(props) {
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
          props.handleUser(0);
          return navigate("/auth");
        } else {
          props.handleUser(1);
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
