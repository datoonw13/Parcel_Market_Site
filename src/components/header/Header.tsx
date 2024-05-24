"use client";

import Logo from "@/icons/Logo";
import useAuthCheck from "@/hooks/useAuthCheck";
import Link from "next/link";
import { Box, Button, ClickAwayListener, Container, Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import BurgerIcon from "@/icons/BurgerIcon";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  useAuthCheck();
  return (
    <Box
      sx={{
        bgcolor: "white",
      }}
      id="root-header"
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
          <ResponsiveHeaderMenuItems />
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
      <Button sx={{ textTransform: "none" }} variant="contained">
        Value my land for free
      </Button>
      <Button sx={{ textTransform: "none" }} variant="outlined">
        Sign In
      </Button>
    </Box>
  </Box>
);

const ResponsiveHeaderMenuItems = () => {
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(20);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const setInitialHeaderHeight = () => {
    const el = document.getElementById("root-header");
    if (el) {
      setHeaderHeight(el.getBoundingClientRect().height);
    }
  };

  const setHeaderHeightOnResize = () => {
    const el = document.getElementById("root-header");
    if (el) {
      setHeaderHeight(el.getBoundingClientRect().height);
    }
  };

  useEffect(() => {
    setInitialHeaderHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", setHeaderHeightOnResize);
    return () => {
      window.removeEventListener("resize", setHeaderHeightOnResize);
    };
  }, []);

  return (
    <ClickAwayListener
      onClickAway={(e) => {
        setOpen(false);
      }}
    >
      <Box sx={{ gap: 4, alignItems: "center", "& > a": { fontWeight: 500 }, position: "relative", display: "flex" }}>
        <>
          <IconButton ref={buttonRef} sx={{ p: { xs: 0, sm: 1 } }} onClick={() => setOpen(!open)}>
            <BurgerIcon />
          </IconButton>

          <Drawer
            sx={{
              transform: `translateY(${headerHeight}px)`,
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
                "& > a": { fontSize: { xs: 14 }, py: 1.25, "&:hover": { color: "primary.main" }, transition: "all 0.1s" },
              }}
            >
              <Link href="/">Sell your property</Link>
              <Link href="/">Find a Preferred Land Agent</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/">Value my land for free</Link>
              <Link href="/"> Sign In</Link>
            </Box>
          </Drawer>
        </>
      </Box>
    </ClickAwayListener>
  );
};
