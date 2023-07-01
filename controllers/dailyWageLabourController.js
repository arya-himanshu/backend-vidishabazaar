import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { DailyWageLabourModel } from "../models/dailyWageLabourModel.js";
import { createDailyWageLabourProfile, getLabourAllData } from "../services/DailyWageLabourService.js";

const createLabourProfile = async (req, res, next) => {
    try {
        const {
            name,
            address,
            city,
            pincode,
            state,
            category_id,
            added_by,
            mobile
        } = req.body;

        if (!name) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NAME, undefined, false));
        }
        if (!address) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.ADDRESS, undefined, false));
        }
        if (!city) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CITY, undefined, false));
        }
        if (!state) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.STATE, undefined, false));
        }
        if (!pincode) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PINCODE, undefined, false));
        }
        if (!category_id) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_Id_REQUIRED, undefined, false));
        }
        if (!added_by) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.ACCOUNT_OWNER_REQUIRED, undefined, false));
        }
        if (!mobile) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.MOBILE_IS_REQUIRED, undefined, false));
        }
        const dailyWage = await createDailyWageLabourProfile({
            name,
            address,
            city,
            pincode,
            state,
            category_id,
            added_by,
            mobile
        })
        if (dailyWage) {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, dailyWage, true));
        } else {
            return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.LABOUR_NOT_ADDED, undefined, false));
        }
    } catch (error) {
        console.error(error);
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    }
};

const getAllLabour = async (req, res, next) => {
    try {
        const searchString = req.query.searchString;
        const pageNumber = req.query.pageNumber;
        const nPerPage = req && req.query.nPerPage && req.query.nPerPage ? req.query.nPerPage : 10;
        const city = req?.query?.city ? req?.query?.city?.toLowerCase() : "";
        const locality = req?.query?.locality ? req?.query?.locality?.toLowerCase() : "";
        const pincode = req?.query?.pincode ? req?.query?.pincode?.toLowerCase().toString() : "";
        const labours = await getLabourAllData({
            searchString,
            pageNumber,
            nPerPage,
            city,
            locality,
            pincode
        });
        if (labours && labours.length) {
            return next(ApiGenericResponse.successServerCode("Success", { labours, itemsCount: labourCount }, true));
        } else {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND, { labours: [], itemsCount: 0 }, true));
        }
    } catch (err) {
        console.error(err);
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND, { labours: [], itemsCount: 0 }, true));
    }
}
export { createLabourProfile, getAllLabour };
