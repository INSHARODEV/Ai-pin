import { useEffect, useState } from "react";
import { Shift } from "../types";
import { MakeApiCall, Methods } from "../actions";
import { getChunckedDatat } from "../utils/checuked";
 
export const useShifts = (queryString: any) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPageNumber, setCurrentPage] = useState(1);
  const [rating, setRating] = useState<number>(0);
  const [firstGroup, setFirstGroup] = useState<Shift[]>([]);
  const [secondGroup, setSecondGroup] = useState<Shift[]>([]);
  const [performanceDelta, setPerformanceDelta] = useState<number>(0);
  const [emps, setEmps] = useState<number >(0);

  useEffect(() => {
    async function getShifts(queryString: any) {
      try {
        const { numberOfPages, page, data } = await MakeApiCall({
          url: "/shift?limit=14",
          method: Methods.GET,
          queryString: `limit=14&${queryString}`,
        });

        const fetchedShifts = data as Shift[];
        setShifts(fetchedShifts);
        setNumberOfPages(numberOfPages);
        setCurrentPage(page);

        // Unique employees
        const unique = Array.from(
          new Map(fetchedShifts.map((obj: any) => [obj.emp, obj])).values()
        );
        setEmps(unique.length);

        // Rating calculation
        if (fetchedShifts.length === 0) {
          setRating(0);
        } else if (fetchedShifts.length >= 7) {
          const performances = fetchedShifts
            .slice(0, 6)
            .map((shift) => Number(shift.performance));
          const sum = performances.reduce((a, b) => a + b, 0);
          setRating(sum / 7);
        } else {
          const performances = fetchedShifts.map((shift) =>
            Number(shift.performance)
          );
          const sum = performances.reduce((a, b) => a + b, 0);
          setRating(sum / fetchedShifts.length);
        }

        // Chunk data
        const [first, second] = getChunckedDatat(
          fetchedShifts,
          7
        ) as Shift[][];
        setFirstGroup(first || []);
        setSecondGroup(second || []);

        // Performance delta (average difference)
        const avg = (arr: Shift[]) =>
          arr.length
            ? arr.map((s) => Number(s.performance)).reduce((a, b) => a + b, 0) /
              arr.length
            : 0;

        setPerformanceDelta(avg(first) - avg(second));
      } catch (err) {
        console.error("Failed to fetch shifts:", err);
      }
    }

    getShifts(queryString);
  }, [queryString]);

  return {
    shifts,
    numberOfPages,
    currentPageNumber,
    rating,
    firstGroup,
    secondGroup,
    performanceDelta,
    emps,
  };
};
