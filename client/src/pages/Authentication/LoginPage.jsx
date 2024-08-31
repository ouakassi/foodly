import { useState, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "./LoginPage.css";
import { RiUserLine, RiLockPasswordLine, RiMailLine } from "react-icons//ri";

import CustomButton from "../../components/Buttons/CustomButton";

import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";
import Form from "../../components/Forms/Form";
import ErrorMsg from "../../components/Errors/ErrorMsg";
import API from "../../api/api";

//  validation schema
let validationSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [togglePassword, setTogglePassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  // focus in email input while loading the page
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", data, {
        withCredentials: true,
      });
      navigate("/");
      console.log(response);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("nothing");
      }
    }
  };

  return (
    <div className="login">
      <FormContainer
        headingTitle="login"
        headingIcon={<RiUserLine className="icon" />}
        headingText="enter your email and password to login"
        footer={
          <>
            don't have an account ?&nbsp;
            <Link style={{ color: "var(--color-4)" }} to="/auth/register">
              Register
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer
            labelText="email"
            icon={<RiMailLine />}
            errorMsg={errors.email?.message}
          >
            <input {...register("email")} />
          </InputContainer>

          <InputContainer
            togglePassword={togglePassword}
            setTogglePassword={setTogglePassword}
            isPassword={true}
            labelText="password"
            icon={<RiLockPasswordLine />}
            errorMsg={errors.password?.message}
          >
            <input
              type={togglePassword ? "text" : "password"}
              {...register("password")}
            />
          </InputContainer>

          <div className="form-footer">
            <Link
              className="form-reset"
              style={{ color: "var(--color-4)" }}
              to="/auth/forgot-password"
            >
              forgot password ?{" "}
            </Link>
            {/* <div className="form-remember">
              <input
                type="checkbox"
                id="rememberInput"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberInput">remember me</label>
            </div> */}
          </div>
          <CustomButton
            isTypeSubmit={true}
            disabled={!isValid}
            style={{ fontSize: "var(--fs-m)" }}
            text="login"
          />
          {errorMsg && (
            <ErrorMsg style={{ textAlign: "center" }} errorMsg={errorMsg} />
          )}
        </Form>
      </FormContainer>
    </div>
  );
}
