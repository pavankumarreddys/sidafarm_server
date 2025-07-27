const Joi = require('joi');

const registerVehicleSchema = Joi.object({
  vehicleNumber: Joi.string().trim().required().messages({
    'string.empty': 'Vehicle number is required.',
    'any.required': 'Vehicle number is required.'
  }),
  type: Joi.string().valid('Small', 'Dcm').required().messages({
    'any.only': 'Vehicle type must be either Small or Dcm.',
    'any.required': 'Vehicle type is required.'
  }),
  driverName: Joi.string().trim().required().messages({
    'string.empty': 'Driver name is required.',
    'any.required': 'Driver name is required.'
  }),
  mobileNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be a valid 10-digit Indian number.',
      'any.required': 'Mobile number is required.'
    }),
  driverRole: Joi.string().valid('driver', 'dcmdriver').default('driver').messages({
    'any.only': 'Driver role must be either driver or dcmdriver.'
  })
});



module.exports = {
  registerVehicleSchema,
};
