import "./UserPage.css";
import {
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import { API_ENDPOINTS, APP_LINKS, LINKS_WITH_ICONS } from "../../../constants";
import React, { useCallback, useState } from "react";
import PageTitle from "../../../components/Dashboard/PageTitle";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { formatDate } from "../../../lib/helpers";
import { RiUser4Line, RiUserAddFill } from "react-icons/ri";
import CustomButton from "../../../components/Buttons/CustomButton";
import { LiaUserAstronautSolid, LiaUserShieldSolid } from "react-icons/lia";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UsersOverview from "./UsersOverview";
import { HiDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdEditDocument, MdOutlineZoomOutMap } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { IoShield } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { Link, useSearchParams } from "react-router-dom";
import {
  NextBtn,
  PreviousBtn,
  TableBtns,
} from "../../../components/Table/TableBtns";

const columns = ["Name", "Status", "Joined At", "Role", "Actions"];
export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("none");

  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpen = useCallback((type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  }, []);

  const params = {
    role: searchParams.get("role"),
  };

  const {
    data: usersData,
    loading,
    error,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.USERS, params);

  const {
    data: usersOverviewData,
    usersOverviewLoading,
    usersOverviewError,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.USERS_OVERVIEW);

  const { usersCount, adminCount, customersCount, moderatorsCount } =
    usersOverviewData?.data || {};

  const handleTabChange = (value) => {
    // reset the 'status' param and 'page'
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("role", value);
    newSearchParams.set("page", 1);

    setSearchParams(newSearchParams);
  };

  const role = searchParams.get("role");

  const tabs = [
    {
      value: "all",
      label: "All",
      icon: <CiGrid41 className="icon" />,
      count: usersCount || 0,
    },
    {
      value: "user",
      label: "Customers",
      icon: <RiUser4Line className="icon" />,
      count: customersCount || 0,
    },

    {
      value: "admin",
      label: "Admins",
      icon: <LuCrown className="icon" />,
      count: adminCount || 0,
    },
    {
      value: "moderator",
      label: "Moderators",
      icon: <IoShield className="icon" />,
      count: moderatorsCount || 0,
    },
  ];

  const getRole = (roleName) => {
    switch (roleName) {
      case "admin":
        return {
          role: "Admin",
          className: "admin-role",
          icon: <LuCrown />,
        };
      case "user":
        return {
          role: "Customer",
          className: "user-role",
          icon: <RiUser4Line />,
        };

      case "moderator":
        return {
          role: "Moderator",
          className: "moderator-role",
          icon: <IoShield />,
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
        <Link to={APP_LINKS.USER_CREATE}>
          <CustomButton text="add user" icon={<RiUserAddFill />} />
        </Link>
      </header>
      <div className="overview-cards">
        <UsersOverview />
      </div>

      <div className="users-page-container">
        <header>
          <Tabs defaultValue={role ? role : "all"} className="w-[400px]">
            {usersOverviewData && (
              <FilterTabsList tabs={tabs} handleTabChange={handleTabChange} />
            )}
          </Tabs>

          <TableBtns />
        </header>
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
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button className="actions-btn">
                            <HiDotsVertical />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => {
                              handleOpen("showOrder");
                              onSelectOrderId(order.id);
                            }}
                          >
                            <MdOutlineZoomOutMap />
                            View Order
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={() => handleOpen("editOrder")}
                          >
                            <MdEditDocument />
                            Edit Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
          </TableBody>
        </Table>
        <footer className="table-footer">
          <TableBtns showPageNumber={true} page={1} />
        </footer>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {dialogType === "showOrder" && <div>fsdfsdfsdf</div>}
        {dialogType === "editOrder" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
            </DialogHeader>
            <p>Form to edit the order will go here.</p>
            <input type="checkbox" />
            <button>Submit</button>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

const FilterTabsList = ({ tabs, handleTabChange }) => {
  return (
    <TabsList>
      {tabs.map(({ value, label, icon, count }) => (
        <TabsTrigger
          key={value}
          value={value}
          onClick={() => handleTabChange(value)}
        >
          <div>
            {icon} <span>{label}</span>
            <Badge>{count}</Badge>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

const Badge = ({ children }) => <span className="badge">{children}</span>;
