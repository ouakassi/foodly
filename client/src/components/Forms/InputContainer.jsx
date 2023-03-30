import "./InputContainer.css";
import { BiShow, BiHide } from "react-icons/bi";
import { TbNorthStar } from "react-icons/tb";

import ErrorMsg from "../Errors/ErrorMsg";

const errorMsgStyle = {
  color: "red",
  borderRadius: "0px",
  boxShadow: "0px 2px 0px 0px red",
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
}) {
  return (
    <div className="input__container">
      <div
        ref={toRef}
        className="input"
        style={errorMsg ? errorMsgStyle : null}
      >
        {labelText && (
          <label htmlFor={labelText}>
            {labelText}{" "}
            {isFieldRequired && <span className="required__icon">*</span>}
          </label>
        )}
        {icon && <span className="input__icon">{icon}</span>}

        {children}
        {isPassword && (
          <div className="toggle__password-icon">
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
