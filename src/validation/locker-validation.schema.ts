import Joi from 'joi';

const validLockerStatuses = ['OPEN', 'CLOSED'];

export const lockerQuerySchema = Joi.object({
  bloqId: Joi.string().optional(),
  status: Joi.string()
    .valid(...validLockerStatuses)
    .insensitive()
    .optional(),
  isOccupied: Joi.bool().optional(),
});

export const lockerBodySchema = Joi.object({
  bloqId: Joi.string().required(),
  status: Joi.string()
    .valid(...validLockerStatuses)
    .insensitive()
    .required(),
  isOccupied: Joi.bool().required(),
});
