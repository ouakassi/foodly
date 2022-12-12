import { useLayoutEffect } from "react";

export default function useChangeBodyColor(color) {
  return useLayoutEffect(() => {
    document.body.style.background = color;

    return () => {
      document.body.style.background = "var(--body-color)";
    };
  }, [color]);
}
