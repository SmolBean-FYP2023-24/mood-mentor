import React from "react";
import { Badge } from "react-bootstrap";

const BadgeList = ({ badges }) => {
  return (
    <div>
      {badges.map((badge, index) => (
        <Badge key={index} variant="primary" className="m-2">
          {badge}
        </Badge>
      ))}
    </div>
  );
};

export default BadgeList;
