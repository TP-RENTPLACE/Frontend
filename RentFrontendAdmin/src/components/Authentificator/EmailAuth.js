import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/EmailStyles.css';
import logo from '../../assets/logo.png';
import { MdOutlineMail } from "react-icons/md";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

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

  const enterNewEmail = () => {
    setEmail("");
    setCode("");
    setStep(1);
  };

  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newCodeArray = code.split("");
    newCodeArray[index] = value;
    const newCode = newCodeArray.join("");
    setCode(newCode);

    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Rentplace Logo" className="auth-logo" />
      <h6 className="auth-subtitle">Administration</h6>

      <div className="auth-box">
        {step === 1 ? (
          <>
            <h6 className="auth-title">Войдите в аккаунт</h6>
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
              <span className="auth-input-icon"><MdOutlineMail /></span>
            </div>
            <button onClick={sendCode} className="auth-button auth-button-primary">
              Далее
            </button>
          </>
        ) : (
          <>
            <h6 className="auth-title">Войдите в аккаунт</h6>
            <p className="auth-description">Проверьте вашу почту и введите код ниже.</p>
            <div className="code-input-container">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="code-input"
                  value={code[index] || ""}
                  onChange={(e) => handleCodeChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            <button onClick={verifyCode} className="auth-button auth-button-success">
              Войти
            </button>
            <button onClick={enterNewEmail} className="auth-button auth-button-secondary">
              Ввести другую почту
            </button>
          </>
        )}
      </div>
    </div>
  );
}
