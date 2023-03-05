import * as Joi from 'joi';

export default Joi.object({
  APP_BASE_URL: Joi.number().required(),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  SYSTEM_EMAIL: Joi.string().required(),
  SYSTEM_PASSWORD: Joi.string().required(),
  RUN_SEED: Joi.string().allow(''),
});
