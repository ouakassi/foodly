import "./UserPage.css";
import {
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import { API_ENDPOINTS, LINKS_WITH_ICONS } from "../../../constants";
import React from "react";
import PageTitle from "../../../components/Dashboard/PageTitle";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { formatDate } from "../../../lib/helpers";
import { CiMail } from "react-icons/ci";
import { RiUser4Line, RiUserAddFill } from "react-icons/ri";
import CustomButton from "../../../components/Buttons/CustomButton";
import { FiUserPlus } from "react-icons/fi";
import { LiaUserAstronautSolid, LiaUserShieldSolid } from "react-icons/lia";
import AnalyticsCard from "../../../components/Dashboard/AnalyticCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UsersOverview from "./UsersOverview";

const columns = ["Name", "Status", "Joined At", "Role", "Actions"];
export default function UsersPage() {
  const {
    data: usersData,
    loading,
    error,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.USERS);

  const getRole = (roleName) => {
    switch (roleName) {
      case "admin":
        return {
          role: "Admin",
          className: "admin-role",
          icon: <LiaUserShieldSolid />,
        };
      case "user":
        return { role: "User", className: "user-role", icon: <RiUser4Line /> };

      case "moderator":
        return {
          role: "Moderator",
          className: "moderator-role",
          icon: <LiaUserAstronautSolid />,
        };

      default:
        return { role: "User", className: "user-role", icon: <RiUser4Line /> };
    }
  };
  return (
    <section className="users-page">
      <header>
        <PageTitle
          icon={React.createElement(LINKS_WITH_ICONS.users.icon)}
          title={LINKS_WITH_ICONS.users.label}
        />
        <CustomButton text="add user" icon={<RiUserAddFill />} />
      </header>
      <div className="overview-cards">
        <UsersOverview />
      </div>

      <div className="orders-page-container">
        <Table className="users-table">
          <TableHead className="users-table__head" columns={columns} />
          <TableBody className="users-table__tbody">
            {usersData &&
              usersData.length > 0 &&
              usersData.map((user) => {
                const { role, className, icon } = getRole(user.role.name);
                console.log(user.isActive);
                return (
                  <tr key={user.id}>
                    {/* <td className="id">{user.id}</td> */}
                    <td className="user-info">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{user.email}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="tooltip-content">
                              {user.firstName + " " + user.lastName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {/* <span>
                        <RiUser4Line />
                        {`${user.firstName} ${user.lastName}`}
                      </span>
                      <span>
                        <CiMail />
                        {user.email}
                      </span>{" "} */}
                    </td>
                    {/* <td className=""></td> */}
                    <td>
                      <span
                        className={`status ${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="created-at">{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`role ${className}`}>
                        {icon}
                        {role}
                      </span>
                    </td>
                    <td className="actions">
                      {/* Actions can be added here, like edit or delete */}
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
