import { useEffect } from "react";

function useCheckIfClickedOutside(state, setState, ref) {
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (state && ref.current && !ref.current.contains(e.target)) {
        console.log(e.target);
        setState(false);
        console.log(e.target);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [state, setState, ref]);
}

export default useCheckIfClickedOutside;
