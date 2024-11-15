import { Bloq } from '../models/bloq.model';
import { Locker } from '../models/locker.model';
import { Rent } from '../models/rent.model';
import initialBloqs from '../data/bloqs.json';
import initialLockers from '../data/lockers.json';
import initialRents from '../data/rents.json';

/**
 * Loads initial data into the database if it is empty
 */
export const loadInitialDataToDb = async (): Promise<void> => {
  try {
    const bloqCount: number = await Bloq.countDocuments();
    if (bloqCount === 0) {
      await Bloq.insertMany(initialBloqs);
    }

    const lockerCount: number = await Locker.countDocuments();
    if (lockerCount === 0) {
      await Locker.insertMany(initialLockers);
    }

    const rentCount: number = await Rent.countDocuments();
    if (rentCount === 0) {
      await Rent.insertMany(initialRents);
    }
  } catch (error) {
    console.error('inital db data error', error);
  }
};
