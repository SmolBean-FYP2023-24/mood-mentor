import { Link } from "react-router-dom";
import "./login_form.css";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";

export default function LoginForm() {
  let [loginState, setLoginState] = useState(0);

  useEffect(() => {
    console.log(loginState);
  }, [loginState]);

  function handleLoginState() {
    if (loginState == 0) {
      setLoginState(1);
    }
  }

  async function signIn(username, password) {
    try {
      // Commented AWS Part
      // const user = await Auth.signIn(username, password);
      console.log(user);
      handleLoginState();
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  return (
    <>
      <div id="login_form" className="card border-0">
        <div className="row w-100 ">
          <div
            className="border rounded p-lg-5 p-md-3 p-2 mx-auto w-sm-100 w-md-75"
            id="login_card"
          >
            <div className="mb-5">
              <label className="text-center w-100">
                <h1>MoodMentor</h1>
                <h6 className="py-3">Hello, welcome back!</h6>
              </label>
            </div>
            <div className="mb-4">
              <span className="small">Email</span>
              <input
                type="email"
                className="form-control mt-1"
                id="inputEmail"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-5">
              <span className="small">Password</span>
              <input
                type="password"
                className="form-control mt-1"
                id="inputPassword"
                placeholder="Password"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100 mb-4"
              onClick={() =>
                signIn(
                  document.getElementById("inputEmail").value,
                  document.getElementById("inputPassword").value
                )
              }
            >
              Login
            </button>
            <label className="text-center w-100">
              Don't have an account yet? <Link to={"#"}>Create account</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
