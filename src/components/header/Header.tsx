"use client";

import Logo from "@/icons/Logo";
import useAuthCheck from "@/hooks/useAuthCheck";
import Link from "next/link";
import { Box, Button, ClickAwayListener, Container, Drawer, IconButton } from "@mui/material";
import BurgerIcon from "@/icons/BurgerIcon";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@mui/icons-material";
import routes from "@/helpers/routes";

const Header = () => {
  useAuthCheck();
  return (
    <Box
      sx={{
        bgcolor: "white",
      }}
      id="landing-header"
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          m: "auto",
          py: { xs: 2, md: 3 },
        }}
      >
        <Link href="/">
          <Box sx={{ width: { xs: 85, sm: 110, md: 125, lg: 140 }, cursor: "pointer" }} id="root-header-logo">
            <Logo />
          </Box>
        </Link>
        <Box sx={{ ml: "auto", display: { xs: "flex", lg: "none" } }}>
          <ResponsiveHeaderMenuItems rootId="landing-header" />
        </Box>
        <Box sx={{ display: { xs: "none", lg: "flex" } }}>
          <HeaderMenuItems />
        </Box>
      </Container>
    </Box>
  );
};

export default Header;

const HeaderMenuItems = () => (
  <Box
    sx={{
      gap: 4,
      alignItems: "center",
      "& > a": { fontWeight: 500, fontSize: 14, "&:hover": { color: "primary.main" }, transition: "all 0.1s" },
      display: "flex",
    }}
  >
    <Link href="/">Sell your property</Link>
    <Link href="/">Find a Preferred Land Agent</Link>
    <Link href="/about-us">About Us</Link>
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Link href={routes.propertySearch.root}>
        <Button sx={{ textTransform: "none" }} variant="contained">
          Value my land for free
        </Button>
      </Link>
      <Link href={routes.auth.signIn}>
        <Button sx={{ textTransform: "none" }} variant="outlined">
          Sign In
        </Button>
      </Link>
    </Box>
  </Box>
);

export const ResponsiveHeaderMenuItems = ({ rootId }: { rootId: string }) => {
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
