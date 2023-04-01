import { Person } from "../types";
import { personStartingToday } from "../data";

export const allPersons = async (): Promise<Array<Person>> => {
  return await Promise.resolve([personStartingToday]);
};

export const personById = async (id: string): Promise<Person> => {
  return await Promise.resolve(personStartingToday);
};
