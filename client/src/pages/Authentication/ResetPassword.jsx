import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";

import Form from "../../components/Forms/Form";
import InputContainer from "../../components/Forms/InputContainer";
import CustomButton from "../../components/Buttons/CustomButton";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import FormContainer from "../../components/Forms/FormContainer";

//  validation schema
let validationSchema = Yup.object({
  newPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "both passwords should be matching"
  ),
});

export default function ResetPassword() {
  const [togglePasswordOne, setTogglePasswordOne] = useState(false);
  const [togglePasswordTwo, setTogglePasswordTwo] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // focus in Password input on Loading
  useEffect(() => {
    setFocus("newPassword");
  }, [setFocus]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormContainer headingTitle="reset password" headingText="">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer
          isPassword={true}
          togglePassword={togglePasswordOne}
          setTogglePassword={setTogglePasswordOne}
          labelText="new password"
          icon={<RiLockPasswordLine />}
          errorMsg={errors.newPassword?.message}
        >
          <input
            type={togglePasswordOne ? "text" : "password"}
            {...register("newPassword")}
          />
        </InputContainer>
        <InputContainer
          isPassword={true}
          togglePassword={togglePasswordTwo}
          setTogglePassword={setTogglePasswordTwo}
          labelText="confirm new password"
          icon={<RiLockPasswordFill />}
          errorMsg={errors.confirmNewPassword?.message}
        >
          <input
            type={togglePasswordTwo ? "text" : "password"}
            {...register("confirmNewPassword")}
          />
        </InputContainer>
        <CustomButton text="reset password" isTypeSubmit={true} />
      </Form>
    </FormContainer>
  );
}
