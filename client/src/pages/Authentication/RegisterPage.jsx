import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/api";

import "./RegisterPage.css";
import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";
import Form from "../../components/Forms/Form";

import {
  RiUserAddLine,
  RiLockPasswordLine,
  RiMailLine,
  RiLockPasswordFill,
} from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import CustomButton from "../../components/Buttons/CustomButton";

let validationSchema = Yup.object({
  firstName: Yup.string()
    .nullable()
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
    "both passwords should be matching"
  ),
});

const date = new Date().toISOString().substring(0, 10);

console.log(date);

export default function RegisterPage() {
  const [togglePasswordOne, setTogglePasswordOne] = useState(false);
  const [togglePasswordTwo, setTogglePasswordTwo] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "onChange" });

  // focus in email input while loading the page
  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...rest } = data;
      console.log(rest);
      const response = await axiosInstance.post("/auth/register", rest);

      console.log(response.data.message);
    } catch (err) {
      // setIsError(true);
      // setErrorMsg(err);
      console.error(err.message);
      console.error(err.request);
      console.error(err.response);
    }
  };

  return (
    <div className="register">
      <FormContainer
        headingTitle="register"
        headingIcon={<RiUserAddLine className="icon" />}
        headingText="insert your infos to register"
        footer={
          <>
            Already have an account ?&nbsp;
            <Link style={{ color: "var(--color-4)" }} to="/auth/login">
              Login
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            isFieldRequired={true}
          >
            <input {...register("email")} />
          </InputContainer>
          <InputContainer
            labelText="password"
            icon={<RiLockPasswordLine />}
            errorMsg={errors.password?.message}
            isPassword={true}
            togglePassword={togglePasswordOne}
            setTogglePassword={setTogglePasswordOne}
            isFieldRequired={true}
          >
            <input
              type={togglePasswordOne ? "text" : "password"}
              {...register("password")}
            />
          </InputContainer>
          <InputContainer
            labelText="confirm password"
            icon={<RiLockPasswordFill />}
            errorMsg={errors.confirmPassword?.message}
            isPassword={true}
            togglePassword={togglePasswordTwo}
            setTogglePassword={setTogglePasswordTwo}
            isFieldRequired={true}
          >
            <input
              type={togglePasswordTwo ? "text" : "password"}
              {...register("confirmPassword")}
            />
          </InputContainer>
          <CustomButton
            disabled={!isValid}
            text="create account"
            isTypeSubmit={true}
          />
        </Form>
      </FormContainer>
    </div>
  );
}
