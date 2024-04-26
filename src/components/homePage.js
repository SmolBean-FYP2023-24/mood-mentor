import { getCurrentUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioRecorder from "./audio";

function Home(props) {
  let navigate = useNavigate();

  async function isLoggedIn() {
    try {
      const user = await getCurrentUser();
      console.log(user);
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
    <div>
      <AudioRecorder></AudioRecorder>
    </div>
  );
}

export default Home;
