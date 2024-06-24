"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

interface UserMenuListItemProps {
  path: string;
  label: string;
  icon: ({ className }: { className?: string | undefined }) => ReactElement;
  onClick?: () => void;
  listItemClasses?: string;
}
const UserMenuListItem = ({ path, onClick, label, icon: Icon, listItemClasses }: UserMenuListItemProps) => {
  const pathname = usePathname();
  return (
    <Link key={label} href={path} onClick={onClick}>
      <li className="flex items-center  gap-1.5 cursor-pointer group">
        <Icon className={clsx("group-hover:fill-primary-main transition-all duration-0.1", pathname === path && "fill-primary-main")} />
        <p
          className={clsx(
            "text-xs group-hover:text-primary-main transition-all duration-0.1",
            pathname === path && "text-primary-main",
            listItemClasses
          )}
        >
          {label}
        </p>
      </li>
    </Link>
  );
};

export default UserMenuListItem;
