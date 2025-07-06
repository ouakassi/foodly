import "./UsersOverview.css";

import AnalyticCard from "../../../components/Dashboard/AnalyticCard";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";

import { FaRegUser } from "react-icons/fa";
import { RiUser4Line } from "react-icons/ri";
import { LiaUserAstronautSolid, LiaUserShieldSolid } from "react-icons/lia";

import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { API_ENDPOINTS } from "../../../constants";

export default function UsersOverview() {
  const { data, isLoading, error } = useAxiosFetch(
    API_URL + API_ENDPOINTS.USERS_OVERVIEW
  );

  const {
    usersCount,
    adminCount,
    customersCount,
    moderatorsCount = {}, // fallback to empty object to avoid undefined errors
  } = data?.data || {};

  const loadingSpinner = (
    <LoadingSpinner height={"1.2rem"} width={"1.2rem"} borderWidth={"2px"} />
  );

  const usersOverviewData = [
    {
      icon: <FaRegUser />,
      label: "Total Users",
      value: isLoading ? loadingSpinner : usersCount,
      // trend: orderGrowth?.toFixed(2) ?? "0.00",

      // description: `compared last month (${totalOrdersPrevious || 0})`,
      // description: "compared last month",
      className: "total-users",
    },
    {
      icon: <RiUser4Line />,
      label: "Total Customers",
      value: isLoading ? loadingSpinner : moderatorsCount,

      // trend: "-5",

      // description: "In This Month",
      className: "total-customers",
    },
    {
      icon: <LiaUserShieldSolid />,
      label: "Total Admins",
      value: isLoading ? loadingSpinner : adminCount,

      // trend: revenueGrowth?.toFixed(2),

      // description: "compared last month",
      className: "total-admins",
    },
    {
      icon: <LiaUserAstronautSolid />,
      label: "Total Moderators",
      value: isLoading ? loadingSpinner : customersCount,

      // trend: "+8",

      // description: "In This Month",

      className: "total-moderators",
    },
  ];

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load order overview data. Please try again.</p>
      </div>
    );
  }

  return (
    data &&
    usersOverviewData.map(
      ({ icon, label, value, trend, description, className }, index) => (
        <AnalyticCard
          key={index}
          icon={icon}
          label={label}
          value={value}
          trend={trend}
          description={description}
          className={className}
        />
      )
    )
  );
}
