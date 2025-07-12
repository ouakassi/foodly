import "./InputContainer.css";
import { BiShow, BiHide } from "react-icons/bi";
import ErrorMsg from "../Errors/ErrorMsg";

const errorMsgStyle = {
  color: "red",
  // borderRadius: "0px",
  boxShadow: "#ffb1b1 0px 0px 0px 1px",
};

export default function InputContainer({
  children,
  labelText,
  isPassword = false,
  icon,
  errorMsg,
  togglePassword,
  setTogglePassword,
  toRef,
  isFieldRequired,
  className = "",
  style,
}) {
  return (
    <div style={style} className={`input-container ${className}`}>
      <div
        ref={toRef}
        className="input"
        style={errorMsg ? errorMsgStyle : null}
      >
        {labelText && (
          <label htmlFor={labelText}>
            {labelText}{" "}
            {isFieldRequired && <span className="required-icon">*</span>}
          </label>
        )}
        {icon && <span className="input-icon">{icon}</span>}

        {children}
        {isPassword && (
          <div className="toggle-password-icon">
            <button
              onClick={(e) => {
                e.preventDefault();
                setTogglePassword(!togglePassword);
              }}
            >
              {togglePassword ? (
                <BiShow color="var(--color-3)" />
              ) : (
                <BiHide color="var(--color-3)" />
              )}
            </button>
          </div>
        )}
      </div>
      {errorMsg && <ErrorMsg errorMsg={errorMsg} />}
    </div>
  );
}
