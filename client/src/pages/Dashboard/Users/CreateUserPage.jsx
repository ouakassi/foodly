import "./CreateUserPage.css";
import PageTitle from "../../../components/Dashboard/PageTitle";
import ContentContainer from "../../../components/Dashboard/ContentContainer";
import InputContainer from "../../../components/Forms/InputContainer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomButton from "../../../components/Buttons/CustomButton";
import { LuUserPlus } from "react-icons/lu";
import { RiUserAddFill, RiUser4Line } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { Checkbox } from "@/components/ui/checkbox";
import { LuCrown } from "react-icons/lu";
import { IoShield } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserValidationSchema } from "../../../../utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_ENDPOINTS, APP_LINKS } from "../../../constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/api";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import { color } from "framer-motion";
const roles = [
  {
    id: "user",
    icon: <RiUser4Line />,
    name: "Customer",
    description: "Standard user access.",
  },
  {
    id: "moderator",
    icon: <IoShield />,
    name: "Moderator",
    description: "Can moderate content, manage users...",
  },
  {
    id: "admin",
    icon: <LuCrown />,
    name: "Administrator",
    description: "Full access to all features.",
  },
];

export default function CreateUserPage({ onUserCreated = () => {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createUserValidationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const selectedRoleId = watch("role");

  useEffect(() => {
    // Set focus when the modal opens, but only if the modal is open.
    if (isModalOpen) {
      // Use a timeout to ensure the element is in the DOM and visible.
      setTimeout(() => {
        setFocus("firstName");
      }, 100);
    }
  }, [isModalOpen, setFocus]);

  const onSubmit = async (data) => {
    try {
      setIsFormLoading(true);
      const response = await axiosInstance.post(API_ENDPOINTS.USER_CREATE, {
        ...data,
      });

      reset();
      setIsModalOpen(false);

      onUserCreated({
        newUser: response.data, // Pass the created user data
        role: data.role, // Pass the role for optimistic updates
      });
      setTimeout(() => {
        toast.success("User created successfully");
      }, 500);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create new user";

      toast.error(message);
    } finally {
      setIsFormLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger>
        <CustomButton text="add user" icon={<RiUserAddFill />} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <PageTitle icon={<LuUserPlus />} title="create user" small={true} />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="create-user">
            <div>
              <ContentContainer
                icon={<FaCircleInfo />}
                className="user-info"
                // title={
                //   <>
                //     <FaCircleInfo /> user info
                //   </>
                // }
              >
                <div className="inputs">
                  <div className="row">
                    <InputContainer
                      labelText="first name"
                      errorMsg={errors?.firstName?.message}
                    >
                      <input
                        type="text"
                        {...register("firstName", {
                          required: true,
                          maxLength: 25,
                        })}
                      />
                    </InputContainer>
                    <InputContainer
                      labelText="last name"
                      errorMsg={errors?.lastName?.message}
                    >
                      <input
                        type="text"
                        {...register("lastName", {
                          required: true,
                          maxLength: 25,
                        })}
                      />
                    </InputContainer>
                  </div>
                  <div className="row">
                    <InputContainer
                      labelText="email"
                      errorMsg={errors?.email?.message}
                    >
                      <input
                        type="email"
                        {...register("email", { required: true })}
                      />
                    </InputContainer>
                  </div>
                  <InputContainer
                    labelText="password"
                    errorMsg={errors?.password?.message}
                  >
                    <input
                      type="password"
                      {...register("password", { required: true })}
                    />
                  </InputContainer>
                </div>

                <div className="role-select">
                  {roles.map(({ id, icon, name, description }) => (
                    <RoleCheckBox
                      key={id}
                      id={id}
                      icon={icon}
                      title={name}
                      desc={description}
                      checked={selectedRoleId === id}
                      selectedRoleId={selectedRoleId}
                      onCheckedChange={() =>
                        setValue("role", id, { shouldValidate: true })
                      }
                    />
                  ))}
                </div>
              </ContentContainer>
            </div>
            <CustomButton
              text={isFormLoading ? "creating user..." : "save user"}
              icon={
                isFormLoading ? (
                  <LoadingSpinner
                    style={{
                      height: "1rem",
                      width: "1rem",
                      borderBottomColor: "white",
                    }}
                  />
                ) : (
                  <FaUserEdit />
                )
              }
              isTypeSubmit={true}
              disabled={isFormLoading}
            />
          </section>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const RoleCheckBox = ({
  id,
  icon,
  title,
  desc,
  checked,
  selectedRoleId,
  onCheckedChange,
}) => (
  <label
    htmlFor={id}
    className={`choice ${id} ${id === selectedRoleId ? "selected" : ""}`}
    style={{ cursor: "pointer" }}
  >
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />

    <div>
      <div className="header">
        <span>
          {icon}
          {title}
        </span>
      </div>
      <p className="desc">{desc}</p>
    </div>
  </label>
);
