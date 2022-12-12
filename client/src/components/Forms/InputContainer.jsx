import "./InputContainer.css";
import { BiShow, BiHide } from "react-icons/bi";
import { TbNorthStar } from "react-icons/tb";

import ErrorMsg from "../Errors/ErrorMsg";

const errorMsgStyle = { color: "red", boxShadow: "0px 0px 0px 4px red" };

export default function InputContainer({
  children,
  labelText,
  isPassword = false,
  icon,
  errorMsg,
  showPassword,
  setShowPassword,
  toRef,
  required,
}) {
  return (
    <div className="input__container">
      <div
        ref={toRef}
        className="input"
        style={errorMsg ? errorMsgStyle : null}
      >
        <label htmlFor={labelText}>
          {labelText} {required && <span className="required__icon">*</span>}
        </label>
        {icon && <span className="input__icon">{icon}</span>}

        {children}
        {isPassword && (
          <div className="toggle__password-icon">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
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
