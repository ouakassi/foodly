import "./AnalyticCard.css";
import { TrendingDown, TrendingUp } from "lucide-react";

const AnalyticCard = ({
  icon,
  label,
  value,
  trend,
  description,
  className,
}) => {
  return (
    <div className={`order-box ${className}`}>
      <div>
        <span className="box-icon">{icon}</span>
        <span className="label">{label}</span>
      </div>
      <span className="value">{value}</span>

      <div>
        {trend && (
          <p className={`trend ${+trend > 0 ? "up" : "down"}`}>
            {trend > 0 ? <TrendingUp /> : <TrendingDown />}
            {trend}%
          </p>
        )}
        <span className="desc">{description || "compared last month"}</span>
      </div>
    </div>
  );
};

export default AnalyticCard;
