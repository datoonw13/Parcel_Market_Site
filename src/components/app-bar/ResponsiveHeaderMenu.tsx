"use client";

import BurgerIcon from "@/icons/BurgerIcon";
import { Input } from "@mui/icons-material";
import { Box, ClickAwayListener, Drawer, IconButton } from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ResponsiveHeaderMenu = ({ rootId }: { rootId: string }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rootEl = useRef<HTMLDivElement | null>(null);

  const toggleResponsiveMenu = useCallback(() => {
    setOpen(!open);
    const parentEl = document.getElementById(rootId);
    if (!open && rootEl.current && parentEl) {
      rootEl.current.style.transform = `translateY(${parentEl.getBoundingClientRect().height - 1}px)`;
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
                "& > a": {
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
              <Link href="/">Sell your property</Link>
              <Link href="/">Find a Preferred Land Agent</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/">Value my land for free</Link>
              <Link href="/">
                <Input fontSize="small" /> Sign In
              </Link>
            </Box>
          </Drawer>
        </>
      </Box>
    </ClickAwayListener>
  );
};

export default ResponsiveHeaderMenu;