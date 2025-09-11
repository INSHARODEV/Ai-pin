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
  const [empsNames,setEmpsNames]=useState<string[]>()

  useEffect(() => {
    async function getShifts(queryString: any) {
      const params = new URLSearchParams();

       Object.entries(queryString).forEach(([key, value]) => {
        if (typeof value === "object") {
          // Convert nested objects (e.g., regex) into JSON strings
          params.set(key, JSON.stringify(value));
        } else {
          params.set(key, String(value));
        }
      });
      
      const query = `${params.toString()}`;
      try {
        const { numberOfPages, page, data } = await MakeApiCall({
          url: "/shift",
          method: Methods.GET,
          queryString: `${query}`,
        });

        const fetchedShifts = data as Shift[];
        setShifts(fetchedShifts);
        setNumberOfPages(numberOfPages);
        setCurrentPage(page);
 
        const unique =  new Set(fetchedShifts.map(shift=>shift.fullName)) as any
        setEmps(unique.size);
        console.log(Array.from(unique))
        setEmpsNames(Array.from(unique) )
 
        const allEmps = [ 
          ...new Map( 
            fetchedShifts.map(shift => [shift.fullName, { name: shift.fullName, _id: shift._id }]) 
          ).values() 
        ]; 
    console.log(allEmps)
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
    empsNames
  };
};
