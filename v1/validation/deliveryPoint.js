const Joi = require('joi');
const mongoose = require('mongoose');

const createDeliveryPointSchema = Joi.object({
  name: Joi.string().trim().required(),
  userId: Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId Validation'),
  location: Joi.string().trim().optional(),
});

const updateDeliveryPointSchema = Joi.object({
  location: Joi.string().trim().optional(),
});

module.exports = {
  createDeliveryPointSchema,
  updateDeliveryPointSchema,
};
