"use client";

import routes from "@/helpers/routes";
import BurgerIcon from "@/icons/BurgerIcon";
import { Box, ClickAwayListener, Drawer, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IDecodedAccessToken, ISignInResponse } from "@/types/auth";
import clsx from "clsx";
import UserMenuList from "../@new/user/user-menu/UserMenuList";
import { LogoutIcon1 } from "../@new/icons/LogutIcons";

const ResponsiveHeaderMenu = ({ rootId, user }: { rootId: string; user: IDecodedAccessToken | null }) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rootEl = useRef<HTMLDivElement | null>(null);

  const toggleResponsiveMenu = useCallback(() => {
    setOpen(!open);
    const parentEl = document.getElementById(rootId);
    if (!open && rootEl.current && parentEl) {
      const headerHeight = parentEl.getBoundingClientRect().top + parentEl.getBoundingClientRect().bottom - 1;
      rootEl.current.style.transform = `translateY(${headerHeight}px)`;
      rootEl.current.style.height = `calc(100vh - ${headerHeight}px)`;
    }
  }, [open, rootId]);

  useEffect(() => {
    window.addEventListener("resize", () => setOpen(false));
  }, []);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <Box sx={{ gap: 4, alignItems: "center", "& > a": { fontWeight: 500 }, position: "relative", display: "flex" }}>
        <>
          <IconButton ref={buttonRef} sx={{ p: 0 }} disableRipple onClick={toggleResponsiveMenu}>
            <BurgerIcon />
          </IconButton>

          <Drawer
            ModalProps={{
              ref: rootEl,
              keepMounted: true,
            }}
            anchor="top"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              elevation: 0,
              sx: (theme) => ({
                borderTop: `1px solid ${theme.palette.grey[100]}`,
                p: 2.5,
                borderBottomRightRadius: 12,
                borderBottomLeftRadius: 12,
              }),
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                "& > div > a": {
                  fontSize: { xs: 14 },
                  py: 1.25,
                  "&:hover": { color: "primary.main" },
                  transition: "all 0.1s",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Box sx={{ color: pathname.includes("/about-us") ? "primary.main" : "inherit" }}>
                <Link onClick={() => setOpen(false)} href="/about-us">
                  About Us
                </Link>
              </Box>
              <Box>
                <Link onClick={() => setOpen(false)} href="/">
                  Find a Land Professional
                </Link>
              </Box>
              <Box>
                <Link onClick={() => setOpen(false)} href={routes.marketplace.fullUrl}>
                  Parcel MarketPlace
                </Link>
              </Box>
              <Box>
                <Link onClick={() => setOpen(false)} href={routes.valueLand.fullUrl}>
                  Get Land Values
                </Link>
              </Box>
            </Box>
            <p className="text-grey-600 text-xs my-4">Personal</p>
            {user ? (
              <UserMenuList listItemClasses="!text-sm" close={() => setOpen(false)} />
            ) : (
              <Link href={routes.auth.signIn.fullUrl}>
                <li className="flex items-center  gap-1.5 cursor-pointer group">
                  <LogoutIcon1 color="primary-main" className="!fill-primary-main transition-all duration-0.1" />
                  <p className={clsx("text-sm transition-all duration-0.1")}>Log In</p>
                </li>
              </Link>
            )}
          </Drawer>
        </>
      </Box>
    </ClickAwayListener>
  );
};

export default ResponsiveHeaderMenu;
