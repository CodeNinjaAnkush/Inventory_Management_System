const mongoose = require("mongoose");
const config = require("../../config/config");
const logger = require("../../config/logger");
const { Shop, Category, Item } = require("../../models");

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
      logger.info("Connected to MongoDB");
    });

    // Clear existing data
    await Shop.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    console.log("Existing data cleared.");

    // Create shops
    const shops = await Shop.insertMany([
      { name: "Shop 1", shop_code: "00001", description: "Shop 1" },
      { name: "Shop 2", shop_code: "00002", description: "Shop 2" },
    ]);
    console.log("Shops created:", shops);

    // Create categories for each shop
//    const categories = [];
//    for (const shop of shops) {
//      const shopCategories = await Category.insertMany([
//        { name: "Electronics", shopId: shop._id },
//        { name: "Groceries", shopId: shop._id },
//        { name: "Clothing", shopId: shop._id },
//      ]);
//      categories.push(...shopCategories);
//    }
//    console.log("Categories created:", categories);
//
//    // Create items for each category
//    const items = [];
//    for (const category of categories) {
//      const categoryItems = await Item.insertMany([
//        {
//          name: `${category.name} Item 1`,
//          price: Math.random() * 100,
//          categoryId: category._id,
//        },
//        {
//          name: `${category.name} Item 2`,
//          price: Math.random() * 100,
//          categoryId: category._id,
//        },
//        {
//          name: `${category.name} Item 3`,
//          price: Math.random() * 100,
//          categoryId: category._id,
//        },
//      ]);
//      items.push(...categoryItems);
//    }
//    console.log("Items created:", items);

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  }
};

// Run the seed function
seedDatabase();
