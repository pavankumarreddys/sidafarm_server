const Joi = require("joi");
const mongoose = require("mongoose");

const trayLoadingSchema = Joi.object({
  vehicleId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid vehicleId format");
      }
      return value;
    }),

  totalTraysLoaded: Joi.number().integer().min(0).required(),

  totalEmptyTrays: Joi.number().integer().min(0).optional(),

  confirmedByAreaIncharge: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid confirmedByAreaIncharge format");
      }
      return value;
    }),

  status: Joi.boolean().optional(),
  reason: Joi.string().allow("").optional(),
  remarks: Joi.string().allow("").optional(),

  emptyTraysCount: Joi.number().integer().min(0).optional(),
  emptyTraysVerifiedByDriver: Joi.string()
    .allow(null)
    .optional()
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid emptyTraysVerifiedByDriver format");
      }
      return value;
    }),

  emptyTraysVerifiedAt: Joi.date().allow(null).optional(),
});


const trayLoadingUpdateSchema = Joi.object({
  id: Joi.string().required().messages({  
    'string.empty': 'Tray loading ID is required.',
    'any.required': 'Tray loading ID is required.'
  }),

  totalTraysLoaded: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Total trays loaded must be a number.',
    'number.min': 'Total trays loaded cannot be negative.'
  }),

  totalEmptyTrays: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Total empty trays must be a number.',
    'number.min': 'Total empty trays cannot be negative.'
  }),

  confirmedByAreaIncharge: Joi.string().optional().messages({
    'string.base': 'Confirmed by Area Incharge must be a valid ID.'
  }),

  status: Joi.boolean().optional().messages({
    'boolean.base': 'Status must be true or false.'
  }),

  reason: Joi.string().allow('').optional().messages({
    'string.base': 'Reason must be a string.'
  }),

  remarks: Joi.string().allow('').optional().messages({
    'string.base': 'Remarks must be a string.'
  }),

  emptyTraysCount: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Empty trays count must be a number.',
    'number.min': 'Empty trays count cannot be negative.'
  }),

  emptyTraysVerifiedByDriver: Joi.string().optional().allow(null).messages({
    'string.base': 'Driver ID must be a valid string or null.'
  }),

  emptyTraysVerifiedAt: Joi.date().optional().allow(null).messages({
    'date.base': 'Empty trays verification date must be a valid date.'
  })
});


module.exports = {
 trayLoadingSchema,
  trayLoadingUpdateSchema

};
