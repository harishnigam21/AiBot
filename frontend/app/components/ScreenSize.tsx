"use client";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { setScreenSize } from "../redux/slices/Layout";

export default function ScreenSize() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleResize = () => {
      dispatch(
        setScreenSize({ width: window.innerWidth, height: window.innerHeight }),
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  return null;
}
