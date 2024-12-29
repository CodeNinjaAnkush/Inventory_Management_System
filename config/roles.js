const allRoles = {
  warehouse_user: ["getUsers", "manageUsers"],
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
  shop_user: ["getUsers", "manageUsers"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
