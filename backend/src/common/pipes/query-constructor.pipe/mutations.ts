import { IMutateQuery } from "./query-constructor.pipe";
 
export interface Mutations<T> {
    strategy: IMutateQuery<T>;
    _id?: string; 
   
  

}
export class UpdatePlayersStatsArrayByAIModelIdStrategy<T> implements IMutateQuery<T> {
  mutate(queryObj: T, _id?: string): Record<string, unknown> {
    if (!Array.isArray(queryObj) || queryObj.length === 0) {
            throw new Error('Invalid player stats array provided');
          }
          const updates = queryObj.map((stat, index) => ({
            updateOne: {
              filter: { _id: _id },
              update: {
                $set: {
                  [`playersStats.$[elem${index}].playerId`]: stat.playerId,
                },
              },
              arrayFilters: [
                { [`elem${index}.AIModelId`]: stat.AIModelId },
              ],
            },
          }));
      
          return { updates };
        
  }
}