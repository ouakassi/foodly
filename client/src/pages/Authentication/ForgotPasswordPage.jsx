import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ForgotPasswordPage.css";
import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";
import { RiMailLine } from "react-icons//ri";
import CustomButton from "../../components/Buttons/CustomButton";
import Form from "../../components/Forms/Form";
import ErrorMsg from "../../components/Errors/ErrorMsg";

//  validation schema
let validationSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [isError, setIsError] = useState(false);

  const userEmail = "lmoutchoo@gmail.com";

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // focus in email input while loading the page
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    if (userEmail !== data.email) {
      setIsError(true);
      return;
    }
    setIsEmailFound(true);
    navigate("/auth/email-sent");
  };

  return (
    <div className="forgot-password">
      <FormContainer
        headingTitle="reset account"
        headingText="please enter your email to reset your password"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer
            labelText="email"
            icon={<RiMailLine />}
            errorMsg={errors.email?.message}
          >
            <input {...register("email")} />
          </InputContainer>
          <div>
            {!isEmailFound && isError && (
              <ErrorMsg errorMsg={"email not found"} />
            )}
          </div>
          <CustomButton
            disabled={!isValid}
            text="reset account"
            isTypeSubmit={true}
          />
        </Form>
      </FormContainer>
    </div>
  );
}
