import Joi from "joi";
/**
 * Validation schema untuk query mendapatkan room dan device yang tersedia
 * Query params: categoryId, bookingDate, startTime, durationMinutes
 */
export declare const getAvailableRoomsAndDevicesSchema: Joi.ObjectSchema<any>;
/**
 * Validation schema untuk query mendapatkan available times
 * Query params: categoryId, bookingDate, durationMinutes
 */
export declare const getAvailableTimesSchema: Joi.ObjectSchema<any>;
/**
 * Validation schema untuk query mendapatkan available dates
 * Query params: branchId, month
 */
export declare const getAvailableDatesSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=bookingQueryValidation.d.ts.map