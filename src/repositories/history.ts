import { DietDay } from "../types";
import { NullDietDay } from "../data";

export const getHistoricalDietDay = async (
  personId: string,
  dateString: string
): Promise<DietDay | null> => {
  return Promise.resolve(NullDietDay);
};
