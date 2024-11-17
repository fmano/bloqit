import { Bloq } from '../models/bloq.model';
import { Locker } from '../models/locker.model';
import { Rent } from '../models/rent.model';
import initialBloqs from '../data/bloqs.json';
import initialLockers from '../data/lockers.json';
import initialRents from '../data/rents.json';
import logger from './logger.util';

/**
 * Loads initial data into the database if it is empty
 */
export const loadInitialDataToDb = async (): Promise<void> => {
  try {
    const bloqCount: number = await Bloq.countDocuments();
    const lockerCount: number = await Locker.countDocuments();
    const rentCount: number = await Rent.countDocuments();

    if (bloqCount === 0 && lockerCount === 0 && rentCount === 0) {
      await Bloq.insertMany(initialBloqs);
      await Locker.insertMany(initialLockers);
      await Rent.insertMany(initialRents);
    }
  } catch (error) {
    logger.error('Initial db data loading error', error);
  }
};
