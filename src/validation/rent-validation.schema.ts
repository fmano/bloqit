import Joi from 'joi';

const validRentStatuses = [
  'CREATED',
  'WAITING_DROPOFF',
  'WAITING_PICKUP',
  'DELIVERED',
];

const validRentSizes = ['XS', 'S', 'M', 'L', 'XL'];

export const rentQuerySchema = Joi.object({
  lockerId: Joi.string().optional(),
  weight: Joi.number().optional(),
  size: Joi.string()
    .valid(...validRentSizes)
    .insensitive()
    .optional(),
  status: Joi.string()
    .valid(...validRentStatuses)
    .insensitive()
    .optional(),
});

export const rentBodySchema = Joi.object({
  lockerId: Joi.string().optional(),
  weight: Joi.number().required(),
  size: Joi.string()
    .valid(...validRentSizes)
    .required(),
  status: Joi.string()
    .valid(...validRentStatuses)
    .insensitive()
    .required(),
});
