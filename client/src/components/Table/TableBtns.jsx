import "./TableBtns.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CustomButton from "@/components/Buttons/CustomButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PreviousBtn = ({ onClick, page, prevBtnRef, totalPages }) => {
  console.log(totalPages);
  const isFirstPage = page <= 1;
  const isTotalPageEmpty = totalPages === 0 || totalPages === undefined;
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="table-buttons" onClick={onClick} ref={prevBtnRef}>
            <CustomButton
              disabled={isFirstPage || isTotalPageEmpty}
              icon={<FaAngleLeft />}
            />
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
  const isTotalPageEmpty = totalPages === 0 || totalPages === undefined;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="table-buttons" onClick={onClick} ref={nextBtnRef}>
            <CustomButton
              disabled={isLastPage || isTotalPageEmpty}
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

const PagesCount = ({ page, totalPages }) => {
  const isSinglePage = totalPages === 1 || totalPages === undefined;
  return (
    <span className="page-info">
      <span className="page-current">{page}</span>/
      {!isSinglePage ? (
        <span className="total-pages">{totalPages}</span>
      ) : (
        <span className="total-pages">1</span>
      )}
    </span>
  );
};

const TableBtns = ({
  handleNextPage,
  handlePreviousPage,
  page,
  totalPages,
  showPageNumber = false,
  prevBtnRef,
  nextBtnRef,
}) => {
  return (
    <div className="table-pages-buttons">
      <PreviousBtn
        onClick={handlePreviousPage}
        page={page}
        totalPages={totalPages}
        prevBtnRef={prevBtnRef}
      />
      {showPageNumber && <PagesCount page={page} totalPages={totalPages} />}

      <NextBtn
        onClick={handleNextPage}
        page={page}
        totalPages={totalPages}
        nextBtnRef={nextBtnRef}
      />
    </div>
  );
};

export { PreviousBtn, NextBtn, PagesCount, TableBtns };
