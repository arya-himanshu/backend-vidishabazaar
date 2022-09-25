class GenericShopModel {
  constructor(shop, products) {
    this._id = shop._id;
    this.shop_mobile = shop.shop_mobile;
    this.shop_name = shop.shop_name;
    this.shop_owner_user_id = shop.shop_owner_user_id;
    this.shop_address = shop.shop_address;
    this.shop_category_id = shop.shop_category_id;
    this.is_shop_active = shop.is_shop_active;
    this.is_shop_varified = shop.is_shop_varified;
    this.is_shop_Physically_available = shop.is_shop_Physically_available;
    this.last_updated = shop.last_updated;
    this.created_at = shop.created_at;
    this.products = products ? products : [];
    this.tags = shop.tags;
  }
}

export default GenericShopModel;
