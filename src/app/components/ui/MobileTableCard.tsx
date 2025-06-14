import { ReactNode, useState } from "react";

type MobileTableCardProps = {
  title: string;
  fields: { label: string; value: string | number }[];
  onClick?: () => void;
  actions?: ReactNode;
};

export const MobileTableCard = ({ title, fields, onClick, actions }: MobileTableCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className="border rounded-md p-4 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{title}</div>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {fields.map((field, idx) => (
          <p key={idx} className={expanded ? "" : "truncate"}>
            <span className="font-medium">{field.label}:</span> {field.value}
          </p>
        ))}
      </div>

      {actions && (
        <div className="flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
};
