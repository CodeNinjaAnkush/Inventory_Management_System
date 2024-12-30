const allRoles = {
  warehouse_user: [
    "manageWarehouseStock",
    "manageUsers",
    "getUsers",
    "manageShops",
    "getShops",
    "manageCategories",
    "getCategories",
    "manageItems",
    "getItems",
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
    "manageUsers",
    "getUsers",
    "manageShops",
    "getShops",
    "manageCategories",
    "getCategories",
    "manageItems",
    "getItems",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
