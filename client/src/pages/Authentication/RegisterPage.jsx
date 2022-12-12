import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";

import "./RegisterPage.css";
import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";

import { IoCreateOutline } from "react-icons/io5";
import {
  RiLockPasswordLine,
  RiMailLine,
  RiLockPasswordFill,
} from "react-icons//ri";
import { AiOutlineUser } from "react-icons/ai";
import SubmitButton from "../../components/Buttons/SubmitButton";

let validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .min(3, "first name should be more than 2 words")
    .max(15, "first name should be less than 15 words"),
  lastName: Yup.string()
    .notRequired()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .min(3, "first name should be more than 2 words")
    .max(15, "first name should be less than 15 words"),

  email: Yup.string().email("Email is invalid").required("email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "both passwords are not matching"
  ),
});

const date = new Date().toISOString().substring(0, 10);

console.log(date);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "all" });

  // focus in email input while loading the page
  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="register">
      <FormContainer
        headingTitle="register"
        headingIcon={<IoCreateOutline className="icon" />}
        headingText="insert your infos to register"
        footer={
          <>
            Already have an account ?
            <Link style={{ color: "var(--color-4)" }} to="/login">
              Login
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <InputContainer
            labelText="first name"
            icon={<AiOutlineUser />}
            errorMsg={errors.firstName?.message}
          >
            <input {...register("firstName")} />
          </InputContainer>
          <InputContainer
            labelText="last name"
            icon={<AiOutlineUser />}
            errorMsg={errors.lastName?.message}
          >
            <input {...register("lastName")} />
          </InputContainer>

          <InputContainer
            labelText="email"
            icon={<RiMailLine />}
            errorMsg={errors.email?.message}
            required={true}
          >
            <input {...register("email")} />
          </InputContainer>
          <InputContainer
            labelText="password"
            icon={<RiLockPasswordLine />}
            errorMsg={errors.password?.message}
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            required={true}
          >
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
          </InputContainer>
          <InputContainer
            labelText="confirm password"
            icon={<RiLockPasswordFill />}
            errorMsg={errors.confirmPassword?.message}
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            required={true}
          >
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
            />
          </InputContainer>
          <SubmitButton disabled={!isValid} text="register" />
        </form>
      </FormContainer>
    </div>
  );
}
