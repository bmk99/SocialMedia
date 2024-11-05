import "./style.css";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import { useState } from "react";

export default function Login() {

  const [visible, setVisible] = useState(false);

  return (

    <div className="login">
      <div className="login_wrapper">
        <LoginForm setVisible={setVisible} />
        {visible && <RegisterForm setVisible={setVisible} />}
      </div>
    </div>
    
  );
}
