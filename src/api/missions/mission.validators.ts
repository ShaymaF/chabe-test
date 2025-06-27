import Joi from 'joi';

export const getMissionsQuerySchema = Joi.object({
  'MIS_DATE_DEBUT#MIN': Joi.date().iso().optional(),
  'MIS_DATE_DEBUT#MAX': Joi.date().iso().optional(),
});

export const createMissionBodySchema = Joi.object({
  MIS_DATE_DEBUT: Joi.date().iso().required(),
  MIS_TSE_ID: Joi.string().required(),
  MIS_TVE_ID: Joi.string().required(),
});