import { DailyWageLabourModel } from "../models/dailyWageLabourModel.js";

const createDailyWageLabourProfile = async (labourData) => {
    try {
        const { name,
            address,
            city,
            pincode,
            state,
            category_id,
            added_by,
            mobile } = labourData;
        return await DailyWageLabourModel.create({
            name,
            address,
            city,
            pincode,
            state,
            category_id,
            added_by,
            mobile, update_at: new Date(), created_at: new Date()
        });
    } catch (err) {
        console.error(err);
        return err;
    }
}

const getLabourAllData = async (requestData) => {
    try {
        const {
            searchString,
            pageNumber,
            nPerPage,
            city,
            locality,
            pincode
        } = requestData;
        let labourCount = await DailyWageLabourModel.count();
        let labours;
        let multiStringsSearch = [];
        const nameRegex = searchString
            ? searchString.split(" ").map((s) => {
                return { name: { $regex: s, $options: "i" } };
            })
            : [];
        const addressRegex = searchString
            ? searchString.split(" ").map((s) => {
                return { address: { $regex: s, $options: "i" } };
            })
            : [];
        const mobileRegex = searchString
            ? searchString.split(" ").map((s) => {
                return { mobile: { $regex: s, $options: "i" } };
            })
            : [];
        const descriptionRegex = searchString
            ? searchString.split(" ").map((s) => {
                return { description: { $regex: s, $options: "i" } };
            })
            : [];
        const search_stringRegex = searchString
            ? searchString.split(" ").map((s) => {
                return { search_string: { $regex: s, $options: "i" } };
            })
            : [];
        const cityStrings = city
            ? city.split(" ").map((s) => {
                return { city: s };
            })
            : [];
        const localityStrings = locality
            ? locality.split(" ").map((s) => {
                return { city: s };
            })
            : [];
        multiStringsSearch = [...nameRegex, ...addressRegex, ...mobileRegex, ...descriptionRegex, ...search_stringRegex];
        const c = [...cityStrings, ...localityStrings, { pincode: pincode }]

        if (searchString) {
            labours = await DailyWageLabourModel.find({
                $and: [
                    {
                        $or:
                            multiStringsSearch

                    },
                    {
                        $or: c
                    }
                ]
            }, { otp: 0 })
                .sort({ created_at: -1 })
                .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
                .limit(nPerPage);
            labourCount = await DailyWageLabourModel.count({
                $and: [
                    {
                        $or:
                            multiStringsSearch

                    },
                    {
                        $or: c
                    }
                ]
            });
        } else {

        }
        return { labours, itemsCount: labourCount };
    } catch (err) {
        console.error(err);
    }

}

export { createDailyWageLabourProfile, getLabourAllData }