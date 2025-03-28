import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/EmailStyles.css';
import logo from '../assets/logo.png';

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const sendCode = () => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000);
    setSentCode(generatedCode);
    console.log("Your code:", generatedCode);
    setStep(2);
  };

  const verifyCode = () => {
    if (parseInt(code) === sentCode) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");  
    } else {
      alert("Неверный код");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Rentplace Logo" className="auth-logo" />
      <h2 className="auth-subtitle">Administration</h2>
      
      <div className="auth-box">
        {step === 1 ? (
          <>
            <h2 className="auth-title">Войдите в аккаунт</h2>
            <p className="auth-description">
              Введите почту. На нее будет отправлено письмо с кодом.
            </p>
            <div className="auth-input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите вашу почту"
                className="auth-input"
              />
              <span className="auth-input-icon">📧</span>
            </div>
            <button onClick={sendCode} className="auth-button auth-button-primary">
              Далее
            </button>
          </>
        ) : (
          <>
            <h2 className="auth-title">Введите код</h2>
            <p className="auth-description">Проверьте вашу почту и введите код ниже.</p>
            <div className="auth-input-container">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Введите код"
                className="auth-input"
              />
            </div>
            <button onClick={verifyCode} className="auth-button auth-button-success">
              Войти
            </button>
          </>
        )}
      </div>
    </div>
  );
}
