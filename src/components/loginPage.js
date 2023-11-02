import LoginForm from "./loginForm";
import "./login.css";

export default function Login() {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="p-0 col-md-6 bg-light" id="left_side">
          {/* <div>Hello</div> */}
        </div>
        <div className="col-sm-12 col-md-6 p-0 bg-light">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
