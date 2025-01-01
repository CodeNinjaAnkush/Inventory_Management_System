const allRoles = {
  warehouse_user: [
    "manageWarehouseStock",
    "getShops",
    "getCategories",
    "getItems",
    "getAllStockBalance",
  ],
  admin: [
    "manageUsers",
    "getUsers",
    "manageShops",
    "getShops",
    "manageCategories",
    "getCategories",
    "manageItems",
    "getItems",
  ],
  shop_user: [
    "manageShopStock",
    "getUsers",
    "getShops",
    "getCategories",
    "getItems",
    "getAllStockBalance",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
