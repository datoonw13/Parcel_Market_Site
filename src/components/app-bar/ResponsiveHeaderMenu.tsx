"use client";

import routes from "@/helpers/routes";
import BurgerIcon from "@/icons/BurgerIcon";
import { Box, ClickAwayListener, Drawer, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ISignInResponse } from "@/types/auth";
import UserMenuList from "../@new/user/user-menu/UserMenuList";

const ResponsiveHeaderMenu = ({ rootId, user }: { rootId: string; user: ISignInResponse["payload"] | null }) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rootEl = useRef<HTMLDivElement | null>(null);

  const toggleResponsiveMenu = useCallback(() => {
    setOpen(!open);
    const parentEl = document.getElementById(rootId);
    if (!open && rootEl.current && parentEl) {
      rootEl.current.style.transform = `translateY(${
        parentEl.getBoundingClientRect().top + parentEl.getBoundingClientRect().bottom - 1
      }px)`;
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
          <IconButton ref={buttonRef} sx={{ p: { xs: 0, sm: 1 } }} onClick={toggleResponsiveMenu}>
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
                <Link href="/about-us">About Us</Link>
              </Box>
              <Box>
                <Link href="/">Find a Land Professional</Link>
              </Box>
              <Box>
                <Link href={routes.marketplace.fullUrl}>Parcel MarketPlace</Link>
              </Box>
              <Box>
                <Link href="/find-property">Value my land for free</Link>
              </Box>
            </Box>
            {user && (
              <>
                <p className="text-grey-600 text-xs my-4">Personal</p>
                <UserMenuList listItemClasses="!text-sm" close={() => setOpen(false)} />
              </>
            )}
          </Drawer>
        </>
      </Box>
    </ClickAwayListener>
  );
};

export default ResponsiveHeaderMenu;
