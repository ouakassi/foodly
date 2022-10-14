import "./UserHead.css";

import { FiUser } from "react-icons/fi";

export default function UserHead({ userName = "user" }) {
  return (
    <div>
      <FiUser className="icon" />
      {userName}
    </div>
  );
}
