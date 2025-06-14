import "./TableBtns.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CustomButton from "@/components/Buttons/CustomButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PreviousBtn = ({ onClick, page, prevBtnRef }) => {
  const isFirstPage = page <= 1;
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span onClick={onClick} ref={prevBtnRef}>
            <CustomButton disabled={isFirstPage} icon={<FaAngleLeft />} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isFirstPage ? "Previous Page" : "You're in first page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const NextBtn = ({ onClick, page, totalPages, nextBtnRef }) => {
  const isLastPage = page >= totalPages;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span ref={nextBtnRef} onClick={onClick}>
            <CustomButton
              disabled={isLastPage}
              icon={<FaAngleRight />}
              aria-label="Next Page"
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isLastPage ? "Next Page" : "Already in Last page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { PreviousBtn, NextBtn };
