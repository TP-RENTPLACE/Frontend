import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/EmailStyles.css';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { MdOutlineMail } from "react-icons/md";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (step === 2 && !canResend) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true); // Убедитесь, что состояние обновляется
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, canResend]);

  useEffect(() => {
    console.log("canResend:", canResend); // Лог для отладки
    if (code.length === 6 && code === sentCode?.toString()) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    }
  }, [code, sentCode, navigate, canResend]); // Добавим canResend сюда для отслеживания изменений

  const sendCode = () => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000);
    setSentCode(generatedCode);
    console.log("Your code:", generatedCode);
    setCode("");
    setCanResend(false);
    setResendTimer(120);
    if (step === 1) setStep(2);
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
      <div className="auth-logo-wrapper">
        <div className="auth-logo-container">
          <Logo className="auth-logo" />
          <span className="auth-logo-text">rentplace</span>
        </div>
        <h6 className="auth-subtitle">Administration</h6>
      </div>

      <div className="auth-box">
        {step === 1 ? (
          <>
            <h6 className="auth-title">Войдите в аккаунт</h6>
            <p className="auth-description">
              Введите почту. На нее будет отправлено письмо с кодом.
            </p>
            <div className="auth-input-wrapper">
              <div className="auth-input-with-icon">
                <MdOutlineMail className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите вашу почту"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-input-wrapper">
              <button onClick={sendCode} className="auth-button auth-button-primary">
                Далее
              </button>
            </div>
          </>
        ) : (
          <>
            <h6 className="auth-title">Войдите в аккаунт</h6>
            <p className="auth-description">
              Введите код из письма, отправленного на <strong>{email}</strong>
            </p>

            <p style={{ fontSize: "14px", marginBottom: "10px" }}>
              Повторная отправка возможна через {resendTimer} секунд
            </p>

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

            {(
              <button
                onClick={sendCode}
                className="auth-button auth-button-primary"
              >
                Отправить код повторно
              </button>
            )}

            <button onClick={enterNewEmail} className="auth-button auth-button-secondary">
              Ввести другую почту
            </button>
          </>
        )}
      </div>
    </div>
  );
}
