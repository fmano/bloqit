import Joi from 'joi';

export const bloqQuerySchema = Joi.object({
  title: Joi.string().optional(),
  address: Joi.string().optional(),
});

export const bloqBodySchema = Joi.object({
  title: Joi.string().required(),
  address: Joi.string().required(),
});
