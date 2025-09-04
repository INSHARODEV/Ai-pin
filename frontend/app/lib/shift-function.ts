// lib/getShifts.ts (or similar server-side file)
import { Shift } from "../types";
import { getChunckedDatat } from "../utils/checuked";

export async function getShiftsData(queryString: string) {
  try {
    // Replace MakeApiCall with direct database query or server-side fetch
    const response = await fetch(`${process.env.API_BASE_URL}/shift?limit=14&${queryString}`, {
      // Add appropriate headers, auth, etc.
    });
    
    const { numberOfPages, page, data } = await response.json();
    const fetchedShifts = data as Shift[];

    // Unique employees
    const unique = Array.from(
      new Map(fetchedShifts.map((obj: any) => [obj.emp, obj])).values()
    );
    const emps = unique.length;
    const empsNames = unique.map(un => un.fullName);

    // Rating calculation
    let rating = 0;
    if (fetchedShifts.length === 0) {
      rating = 0;
    } else if (fetchedShifts.length >= 7) {
      const performances = fetchedShifts
        .slice(0, 6)
        .map((shift) => Number(shift.performance));
      const sum = performances.reduce((a, b) => a + b, 0);
      rating = sum / 7;
    } else {
      const performances = fetchedShifts.map((shift) =>
        Number(shift.performance)
      );
      const sum = performances.reduce((a, b) => a + b, 0);
      rating = sum / fetchedShifts.length;
    }

    // Chunk data
    const [first, second] = getChunckedDatat(fetchedShifts, 7) as Shift[][];
    const firstGroup = first || [];
    const secondGroup = second || [];

    // Performance delta
    const avg = (arr: Shift[]) =>
      arr.length
        ? arr.map((s) => Number(s.performance)).reduce((a, b) => a + b, 0) / arr.length
        : 0;

    const performanceDelta = avg(firstGroup) - avg(secondGroup);

    return {
      shifts: fetchedShifts,
      numberOfPages,
      currentPageNumber: page,
      rating,
      firstGroup,
      secondGroup,
      performanceDelta,
      emps,
      empsNames,
    };
  } catch (err) {
    console.error("Failed to fetch shifts:", err);
    throw err;
  }
}