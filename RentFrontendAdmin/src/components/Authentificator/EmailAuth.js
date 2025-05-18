import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/EmailStyles.css';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as EmailLogo } from '../../assets/Email.svg';
import authService from "../../api/authService";
import {toast} from "react-toastify";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeChange = (e, index) => {
    if (isSubmitting) return;

    const value = e.target.value.replace(/\D/g, '');
    if (!value && code.length <= index) return;

    const newCode = [...code.slice(0, index), value, ...code.slice(index + 1)].join('');
    setCode(newCode);

    if (value && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleLogin = useCallback(async () => {
    const savedEmail = localStorage.getItem("authEmail");
    if (!savedEmail || code.length !== 5 || loading || isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      await authService.login(savedEmail, code);

      localStorage.removeItem("authEmail");
      setStep(1);
      setEmail("");

      navigate("/ads");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("У вас нет прав администратора для входа в админ-панель");
      } else if (err.response?.status === 401) {
        toast.error("Неверный код")
      } else {
        toast.error("Ошибка авторизации. Попробуйте снова.");
        setCode("");
      }

      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [code, loading, isSubmitting, navigate]);

  useEffect(() => {
    if (code.length === 5 && !isSubmitting) {
      handleLogin();
    }
  }, [code, handleLogin, isSubmitting]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("authEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setStep(2);
    }
  }, []);

  useEffect(() => {
    if (step === 2 && !canResend) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, canResend]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      toast.error("Некорректный формат email")
      return;
    }

    setLoading(true);

    try {
      const response = await authService.requestCode(email);

      if (response.authType !== "AUTH_LOGIN") {
        toast.error("У вас нет доступа к админ-панели. Указанная почта не зарегистрирована.");
        return;
      }

      localStorage.setItem("authEmail", email);
      setStep(2);
      setCanResend(false);
      setResendTimer(120);
    } catch (err) {
      toast.error("Ошибка отправки кода");
    } finally {
      setLoading(false);
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
                <div className="auth-input-icon-wrapper">
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      placeholder="Введите вашу почту"
                      className="auth-input"
                      disabled={loading}
                  />
                  <EmailLogo className="auth-input-svg-icon" />
                </div>

                <div className="auth-input-wrapper">
                  <button
                      onClick={handleSendCode}
                      className="auth-button auth-button-primary"
                      disabled={loading}
                  >
                    {loading ? "Отправка..." : "Далее"}
                  </button>
                </div>
              </>
          ) : (
              <>
                <h6 className="auth-title">Войдите в аккаунт</h6>
                <p className="auth-description">
                  Введите код из письма, отправленного на <strong>{email}</strong>
                </p>

                {!canResend && (
                    <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                      Повторная отправка возможна через {resendTimer} секунд
                    </p>
                )}

                <div className="code-input-container">
                  {Array.from({ length: 5 }).map((_, index) => (
                      <input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          className="code-input"
                          value={code[index] || ""}
                          onChange={(e) => handleCodeChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          disabled={loading}
                          autoFocus={index === 0 && !code[0]}
                      />
                  ))}
                </div>

                <div className="auth-buttons-container">
                  <button
                      onClick={handleSendCode}
                      className="auth-button-primary"
                      disabled={!canResend || loading}
                  >
                    {loading ? "Отправка..." : "Отправить код повторно"}
                  </button>

                  <button
                      onClick={() => setStep(1)}
                      className="auth-button auth-button-secondary"
                      disabled={loading}
                  >
                    Ввести другую почту
                  </button>
                </div>
              </>
          )}
        </div>
      </div>
  );
}