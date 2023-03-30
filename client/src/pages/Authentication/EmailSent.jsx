import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./EmailSent.css";
import Form from "../../components/Forms/Form";
import FormContainer from "../../components/Forms/FormContainer";
import InputContainer from "../../components/Forms/InputContainer";
import Button from "../../components/Buttons/Button";
import ErrorMsg from "../../components/Errors/ErrorMsg";

export default function EmailSent() {
  const [insertedOtp, setInsertedOtp] = useState("");
  const [userEmail, setUserEmail] = useState("email@gmail.com");
  const [isValidOtp, setIsValidOtp] = useState(false);
  const [isError, setIsError] = useState(false);

  const INPUTS_LENGTH = new Array(4).fill("");
  const validOtp = "0000";
  const navigate = useNavigate();
  const ERROR__MSG = "invalid PIN please try again";

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    // resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const inputs = getValues();

  // focus in email input while loading the page
  useEffect(() => {
    setFocus(Object.keys(inputs)[0]);
  }, [setFocus, inputs]);

  useEffect(() => {
    isValidOtp && navigate("/auth/reset-password");
  }, [isValidOtp, navigate]);

  const onSubmit = (data) => {
    if (Object.values(data).join("") === validOtp) {
      setIsValidOtp(true);
    } else {
      setIsError(true);
      reset();
    }
  };

  const handleChange = (element, index) => {
    Boolean(element.currentTarget.value) && setFocus(`input${index + 1}`);
  };

  const handleKeyDown = (element, index) => {
    if (element.code === "Backspace") {
      !element.currentTarget.value && setFocus(`input${index - 1}`);
    }
  };

  return (
    <div className="email__sent">
      <FormContainer
        headingText={
          <>
            To confirm your account, enter the 4-digit code we sent to:
            <br />
            <b>{userEmail.toUpperCase()}</b>
          </>
        }
        headingTitle="confirme code"
        footer={
          <>
            wrong email ?
            <Link
              style={{ color: "var(--color-4)" }}
              to="/auth/forgot-password"
            >
              change email
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="digit-inputs">
            {INPUTS_LENGTH.map((_, i) => {
              return (
                <InputContainer key={i}>
                  <input
                    style={{ textAlign: "center" }}
                    maxLength={1}
                    type="text"
                    autoComplete="none"
                    {...register(`input${i}`)}
                    onChange={(e) => handleChange(e, i)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onInput={(e) =>
                      setValue(
                        `input${i}`,
                        e.currentTarget.value.replace(/\D/g, "")
                      )
                    }
                  />
                </InputContainer>
              );
            })}
          </div>
          <Button text="Confirm PIN" />
          {isError && (
            <ErrorMsg style={{ width: "100%" }} errorMsg={ERROR__MSG} />
          )}
        </Form>
      </FormContainer>
    </div>
  );
}
