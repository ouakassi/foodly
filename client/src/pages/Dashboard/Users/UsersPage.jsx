import "./UserPage.css";
import React, { useCallback, useEffect, useState } from "react";
import {
  NoDataFound,
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import { API_ENDPOINTS, APP_LINKS, LINKS_WITH_ICONS } from "../../../constants";
import PageTitle from "../../../components/Dashboard/PageTitle";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { formatDate } from "../../../lib/helpers";
import { RiUser4Line } from "react-icons/ri";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdEditDocument, MdOutlineZoomOutMap } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { IoShield } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { Link, useSearchParams } from "react-router-dom";
import { TableBtns } from "../../../components/Table/TableBtns";

import CreateUserPage from "./CreateUserPage";

const columns = ["Name", "Status", "Joined At", "Role", "Actions"];
export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("none");
  const [usersTableKey, setUsersTableKey] = useState(0); // Force re-render of UsersTable

  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpen = useCallback((type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  }, []);

  const {
    data: usersOverviewData,
    usersOverviewLoading,
    usersOverviewError,
    refetch: refetchUsersOverview,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.USERS_OVERVIEW);

  const handleUserCreated = useCallback(() => {
    // Refetch users overview data
    refetchUsersOverview();

    // Force UsersTable to refetch by changing its key
    setUsersTableKey((prev) => prev + 1);
  }, [refetchUsersOverview]);

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

  return (
    <section className="users-page">
      <header>
        <PageTitle
          icon={React.createElement(LINKS_WITH_ICONS.users.icon)}
          title={LINKS_WITH_ICONS.users.label}
        />
        <CreateUserPage onUserCreated={handleUserCreated} />
      </header>
      <div className="overview-cards">
        <UsersOverview
          data={usersOverviewData}
          isLoading={usersOverviewLoading}
          error={usersOverviewError}
        />
      </div>

      <div className="users-page-container">
        <header>
          <Tabs defaultValue={role ? role : "all"} className="w-[400px]">
            <FilterTabsList tabs={tabs} handleTabChange={handleTabChange} />
          </Tabs>

          <TableBtns />
        </header>
        <UsersTable
          key={usersTableKey} // Force re-render when key changes
        />
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

const UsersTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    role: searchParams.get("role"),
  };
  const {
    data: usersData,
    isLoading,
    error,
    refetch: refetchUsers,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.USERS, params);

  useEffect(() => {
    refetchUsers();
  }, [searchParams]);

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
    <Table className="users-table">
      <TableHead className="users-table__head" columns={columns} />
      {!isLoading && error && (
        <NoDataFound
          message="Error loading orders"
          onClick={() => window.location.reload()}
          btnText="Retry"
          className="error"
          columnsCount={columns.length}
        />
      )}
      {!isLoading && !error && !usersData && (
        <NoDataFound message="no users found" columnsCount={columns.length} />
      )}
      <TableBody className="users-table__tbody">
        {usersData &&
          usersData.length > 0 &&
          usersData.map((user) => {
            const { role, className, icon } = getRole(user.role.name);
            console.log(user.isActive);
            return (
              <tr key={user.id}>
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
                </td>
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
  );
};
