// import PageTitle from "../../components/Dashboard/PageTitle";

import { BsPeople, BsPeopleFill } from "react-icons/bs";
import { Table, TableHead } from "../../components/Table/TableComponents";
import { LINKS_WITH_ICONS } from "../../constants";
import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle";
export default function UsersPage() {
  const columns = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Status",
    "Created At",
    "Actions",
  ];

  return (
    <section className="users-page">
      <PageTitle
        icon={React.createElement(LINKS_WITH_ICONS.users.icon)}
        title={LINKS_WITH_ICONS.users.label}
      />

      <div className="orders-page-container">
        <Table className="users-table">
          <TableHead columns={columns} />
        </Table>
      </div>
    </section>
  );
}
