// hooks/useShifts.ts
import { useEffect, useState } from 'react';
import { Shift } from '../types';
import { MakeApiCall, Methods } from '../actions';
import { getChunckedDatat } from '../utils/checuked';
import { Role } from '../../../shard/src';
import { useUser } from './useUser';

export const useShifts = (queryString: any) => {

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number>(0);
  const [firstGroup, setFirstGroup] = useState<Shift[]>([]);
  const [secondGroup, setSecondGroup] = useState<Shift[]>([]);
  const [performanceDelta, setPerformanceDelta] = useState<number>(0);
  const [emps, setEmps] = useState<number>(0);
  const [empsNames, setEmpsNames] = useState<{
    name: string | undefined;
    _id: string | undefined;
}[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {user, userLoaded }=useUser()
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  console.log('queryString',queryString)
    // If you ONLY want to fetch when branchId exists, early-return until it's present:
    if (!queryString) {
      // Reset to clean empty state while we wait for user/branch
      setShifts([]);
      setNumberOfPages(1);
      setPage(1);
      setRating(0);
      setFirstGroup([]);
      setSecondGroup([]);
      setPerformanceDelta(0);
      setEmps(0);
      setEmpsNames([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    async function getShifts(usrr: any,qs:string) {
      setIsLoading(true);
      setError(null);
 
      const url =  JSON.parse((localStorage.getItem('user')) as any).role=== Role.MANAGER
      ? `/company/branchs/shifts`
      : '/shift';

 
     
 
      try {
      
        const   {data,numberOfPages,page} = await MakeApiCall({
          url,
          method: Methods.GET,
          queryString:  qs ,

        });
     console.log('url;ll',url)
        const fetchedShifts = (data as Shift[]) ?? [];
        console.log('all shifts',queryString)
        setShifts(fetchedShifts);
        setNumberOfPages(numberOfPages ?? 1);
     setPage(page ?? 1);

        // Unique employees
        const allEmps = [  
          ...new Map(  
            fetchedShifts.map(shift => [shift.fullName, { name: shift.fullName, _id: shift.empId }])  
          ).values()  
        ];
        setEmpsNames(allEmps)
        setEmps(allEmps.length)
        // Rating calculation
        if (fetchedShifts.length === 0) {
          setRating(0);
        } else if (fetchedShifts.length >= 7) {
          const performances = fetchedShifts
            .slice(0, 6)
            .map((shift) => Number(shift.performance || 0));
          const sum = performances.reduce((a, b) => a + b, 0);
          const avg = sum / 7;
          setRating(Math.min(5, avg / 20)); // scale 0–100 → 0–5
        } else {
          const sum = fetchedShifts.reduce(
            (acc, s) => acc + Number(s.performance || 0),
            0
          );
          const avg = sum / fetchedShifts.length;
          let r=Number((Math.min(5, avg / 20)).toFixed(2))
          setRating(r);
          console.log('rating',Number((Math.min(5, avg / 20)).toFixed(2)))
        }

        // Chunk data
        const [first, second] = getChunckedDatat(fetchedShifts, 7) as Shift[][];
        setFirstGroup(first || []);
        setSecondGroup(second || []);

        // Performance delta (avg difference)
        const avg = (arr: Shift[]) =>
          arr?.length
            ? arr
                .map(s => Number(s.performance || 0))
                .reduce((a, b) => a + b, 0) / arr.length
            : 0;
        setPerformanceDelta(Math.ceil(avg(first) - avg(second)));
      } catch (err: any) {
        console.error('Failed to fetch shifts:', err);
        setError(err?.message || 'Failed to fetch shifts');
      } finally {
        setIsLoading(false);
      }
    }
console.log('user,usr',JSON.parse((localStorage.getItem('user')) as any).role)
    getShifts(user,queryString);
 
  }, [JSON.stringify(queryString)]); // stable dep for object

  return {
    shifts,
    numberOfPages,
    page ,
    setPage 
    ,
    rating,
    firstGroup,
    secondGroup,
    performanceDelta,
    emps,
    empsNames,
    isLoading,
    error,
  };
};
