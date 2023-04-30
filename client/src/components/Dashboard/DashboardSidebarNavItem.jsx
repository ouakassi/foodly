import { motion } from "framer-motion";

export default function DashboardSidebarNavItem({
  isActive,
  toggleSidebar,
  name,
  tooltip,
  icon,
  hoverIcon,
}) {
  return (
    <li className="dashboard__sidebar-navitem">
      <motion.span
        style={isActive ? { color: "var(--color-3)" } : null}
        className="dashboard__sidebar-icon"
      >
        {isActive ? hoverIcon : icon}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="dashboard__sidebar-text"
      >
        {name}
      </motion.span>
      {toggleSidebar && tooltip && (
        <motion.span
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="dashboard__sidebar-tooltip"
        >
          {tooltip}
        </motion.span>
      )}
    </li>
  );
}
