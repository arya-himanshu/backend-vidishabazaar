class GenericShopModel {
  constructor(shop, products) {
    this._id = shop._id;
    this.mobile = shop.mobile;
    this.name = shop.name;
    this.owner_user_id = shop.owner_user_id;
    this.address = shop.address;
    this.category_id = shop.category_id;
    this.is_shop_active = shop.is_shop_active;
    this.is_shop_varified = shop.is_shop_varified;
    this.is_shop_Physically_available = shop.is_shop_Physically_available;
    this.last_updated = shop.last_updated;
    this.created_at = shop.created_at;
    this.products = products ? products : [];
    this.shop_tags = shop.shop_tags ? shop.shop_tag : [];
    this.description = shop.description;
    this.opening_time = shop.opening_time;
    this.closing_time = shop.closing_time;
    this.days = shop.days;
    this.images = shop.images;
  }
}

export default GenericShopModel;
