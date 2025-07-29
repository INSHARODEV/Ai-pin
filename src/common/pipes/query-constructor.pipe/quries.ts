import { IQuery } from "./query-constructor.pipe";

 class ConstructArrayQuery<T> implements IQuery<T> {
  constructQuery(queryObj: T): Record<string, unknown> {
    const { _id, ...dynamicFields } = queryObj as Record<string, unknown>;
    const filterObj: Record<string, unknown> = _id ? { _id } : {};

    for (const key in dynamicFields) {
      if (Array.isArray(dynamicFields[key])) {
        filterObj[key] = { $in: dynamicFields[key] };
      } else {
        filterObj[key] = dynamicFields[key];
      }
    }

    return filterObj;
  }
}

 export class ConstructOrQuery<T> implements IQuery<T> {
  constructQuery(queryObj: T): Record<string, unknown> {
    const conditions = Object.entries(queryObj as {}).map(([key, value]) => ({
      [key]: value,
    }));

    return { $or: conditions };
  }
}