import * as Joi from 'joi';

export default Joi.object({
  APP_BASE_URL: Joi.number().required(),
});
