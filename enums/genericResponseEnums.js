const GENERIC_RESPONSE_MESSAGES = {
  SUCCESS: "Success",
  INTERNAM_SERVER_ERROR: "Internal server error",
  SOMETHING_WENT_WRONG: "Something went wrong",
  NO_RESULT_FOUND: "No result found",
  PLEASE_TRY_AGAIN: "Please try again later",
  ROLE_IS_REQUIRED: "Role is required",
  USER_NOT_VERIFIED: "User is not verified",
  MOBILE_OR_PASSWORD_NOT_MATCHINF: "Mobile or password not matching",
  FIRST_NAME_REQUIRED: "First name is required",
  DOB: "Date of birth is required",
  MOBILE_IS_REQUIRED: "Mobile number is required",
  PASS_CONFIRMPASS_NOT_MATCHING: "Password and confirm is not matching",
  PASSWORD_IS_REQUIRED: "Password is required",
  CONFIRM_PASS_IS_REQUIRED: "Confirm password is required",
  MOBILE_IN_10_DIGIT: "Mobile numbe should be 10 digits",
  USER_ALREDY_EXIST: "User alredy exist",
  TOKEN_NOT_INSERTED: "Token not insered into database",
  OTP_NOT_MATCHING: "OTP not matching",
  OTP_USER_NOT_FOUND: "Otp or User is not found our database please try again later",
  OTP_REQUIRED: "Otp is required",
  USER_VERIFIED: "User is verified now",
  USER_NOT_FOUND: "User not found please signup now",
  CATEGORY_NAME_REQUIRED: "Category name is required",
  URL_PATH_REQUIRED: "URL path is required",
  LANGUAGE_REQUIRED: "Language name is required",
  ENGLISH_LANGUAGE_REQUIRED: "English language is required, because it is default language",
  CATEGORY_CREATED: "Category was successfully created.",
  CATEGORY_CREATION_FAILED: "Failed to create shop category",
  CATEGORY_ALREADY_CREATED: "Category name ${name} is already created",
  CATEGORY_Id_REQUIRED: "Category ID is required",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_UPDATED: "Category Update successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  SIGNIN_SUCESS: " logged in Successfully",

  // Shop
  SHOP_ID_REQUIRED: "Shop ID is required",
  SHOP_NAME_REQUIRED: "Shop name is required",
  SHOP_OWNER_ID_REQUIRED: "Shop owner ID is required",
  SHOP_CATEGORY_ID_REQUIRED: "Shop category ID is required",
  SHOP_ADDRESS_REQUIRED: "Shop address is required",
  SHOP_MOBILE_REQUIRED: "Shop mobile number is required",
  SHOP_NOT_FOUND: "Shops not found, please try again later",
  SHOP_CREATED_SUCCESSFULY: "Shop Created Successfully",
  DELETE_SHOP_SUCCESS: "shop was successfully deleted",
  SHOP_SUCCESS_VARIFIED: "shop was successfully varified",

  // Product
  PRODUCT_NAME_REQUIRED: "Product name is required",
  PRODUCT_PRICE_REQUIRED: "Product price is required",
  PRODUCT_QUANTITY_REQUIRED: "Product quantity is required",
  SHOP_ID_REQUIRED: "Shop ID required",
  PRODUCT_CREATED_SUCCESSFULY: "Product Created Successfully",

  // search engine
  TAG: "TAGS are required",
  TAG_CREATED: "TAGS created successfully",
  CATEGORY_URL_REQUIRED: "Category url is required",
  CATEGORY_Id_REQUIRED: "Category id is required",

  // Language translate
  LANGUAGE_STRING: "Please provide language string",
  SUCCESS_LANGUAGE_STRING: "Success created language string",
  STRING_TEXT: "String text is required",
  STRING_NOT_FOUND: "String not found",
  STRING_ALREADY_EXIST: "String already exist",

  //ADS
  BANNER_IMAGE_REQUIRED: "Banner image required",
  CUSTOMER_MOBILE_REQUIRED: "Customer mobile number is required",
  URL_REQURED: "URL is required",
  BANNER_CREATED_SUCCESSFULLY: "Banner Ad created successfully",
  BANNER_CREATION_FAILED: "Banner Ad creation failed",
  NO_BANNER_FOUND: "No banner found",
  BANNER_ALREDY_FULL: "No Slot available for banner",

  //SUPER_ADMIN
  NO_PERMISSION: "You don't have right access,please connect with admin",
  TWO_IMAGE_ALLOWED: "Only two images are allowed per shop",
  OTP_SEND_SUCCESSFULLY: "OTP resend succesfully.",
};

export default GENERIC_RESPONSE_MESSAGES;
