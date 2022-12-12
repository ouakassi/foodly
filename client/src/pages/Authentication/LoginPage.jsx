import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "./LoginPage.css";
import { RiLockPasswordLine, RiMailLine } from "react-icons//ri";
import { CgLogIn } from "react-icons/cg";

import SubmitButton from "../../components/Buttons/SubmitButton";
import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";

//  validation schema
let validationSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "all" });

  const values = getValues();
  console.log(values);

  // focus in email input while loading the page
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  console.log("🚀 ~ file: LoginPage.jsx:48 ~ LoginPage ~ isValid", isValid);

  console.log(
    "🚀 ~ file: LoginPage.jsx:50 ~ LoginPage ~ validationSchema",
    validationSchema
  );

  const onSubmit = (data) => {
    console.log("🚀 ~ file: LoginPage.jsx:76 ~ onSubmit ~ data", data);
    console.log(
      "🚀 ~ file: LoginPage.jsx:77 ~ onSubmit ~ errors",
      errors.email
    );
  };

  return (
    <div className="login">
      <FormContainer
        headingTitle="login"
        headingIcon={<CgLogIn className="icon" />}
        headingText="enter your email and password to login"
        footer={
          <>
            No account ?
            <Link style={{ color: "var(--color-4)" }} to="/register">
              Register
            </Link>
          </>
        }
      >
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <InputContainer
            labelText="email"
            icon={<RiMailLine />}
            errorMsg={errors.email?.message}
          >
            <input {...register("email")} />
          </InputContainer>

          <InputContainer
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isPassword={true}
            labelText="password"
            icon={<RiLockPasswordLine />}
            errorMsg={errors.password?.message}
          >
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
          </InputContainer>

          <div className="form__footer">
            <Link
              className="form__reset"
              style={{ color: "var(--color-4)" }}
              to="/reset"
            >
              forgot password ?{" "}
            </Link>
            <div className="form__remember">
              <input
                type="checkbox"
                id="rememberInput"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberInput">remember me</label>
            </div>
          </div>
          <SubmitButton
            disabled={!isValid}
            style={{ marginBottom: "1rem" }}
            text="login"
          />
        </form>
      </FormContainer>
    </div>
  );
}
