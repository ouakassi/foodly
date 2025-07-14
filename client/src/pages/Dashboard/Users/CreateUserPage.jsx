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
import { useState } from "react";
const roles = [
  {
    id: "customer",
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

export default function CreateUserPage() {
  const [selectedRoleId, setSelectedRoleId] = useState("customer");
  return (
    <Dialog>
      <DialogTrigger>
        <CustomButton text="add user" icon={<RiUserAddFill />} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <PageTitle icon={<LuUserPlus />} title="create user" small={true} />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <section className="create-user">
          <header></header>
          <div>
            <ContentContainer
              icon={<FaCircleInfo />}
              className="user-info"
              title={
                <>
                  <FaCircleInfo /> user info
                </>
              }
            >
              <div className="inputs">
                <div className="row">
                  <InputContainer labelText="first name">
                    <input type="text" name="" id="" />
                  </InputContainer>
                  <InputContainer labelText="last name">
                    <input type="text" name="" id="" />
                  </InputContainer>
                </div>
                <div className="row">
                  <InputContainer labelText="email">
                    <input type="email" name="" id="" />
                  </InputContainer>
                </div>
                <InputContainer labelText="password">
                  <input type="password" name="" id="" />
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
                    setChecked={() => setSelectedRoleId(id)}
                    selectedRoleId={selectedRoleId}
                  />
                ))}
              </div>
            </ContentContainer>
          </div>
          <CustomButton text="save user" icon={<FaUserEdit />} />
        </section>
      </DialogContent>
    </Dialog>
  );
}

const RoleCheckBox = ({
  id,
  icon,
  title,
  badge,
  desc,
  checked,
  setChecked,
  selectedRoleId,
}) => (
  <div
    onClick={() => setChecked(id)}
    className={`choice ${id} ${id === selectedRoleId ? "selected" : ""} `}
  >
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={() => setChecked(id)}
    />
    <div>
      <div className="header">
        {/* {title} */}
        <span>
          {icon}
          {id}
        </span>
      </div>
      {/* <span className="badgee">{badge}</span> */}
      <p className="desc">{desc}</p>
    </div>
  </div>
);
