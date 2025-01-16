const db = require("../models");
const GlobalVoucher = db.GlobalVoucher;

const voucherData = [
  // Food Vouchers
  {
    id: 1,
    category: "Food",
    voucher: "Food",
    price: 50000,
    validUntil: "2025-01-10",
    minPurchase: 100000,
    maxDiscount: 50000,
    code: "FOOD50",
  },
  {
    id: 2,
    category: "Food",
    voucher: "Food Express",
    price: 25000,
    validUntil: "2025-01-15",
    minPurchase: 75000,
    maxDiscount: 25000,
    code: "FOODEX25",
  },
  {
    id: 3,
    category: "Food",
    voucher: "Food Special",
    price: 100000,
    validUntil: "2025-02-01",
    minPurchase: 200000,
    maxDiscount: 100000,
    code: "FOODSP100",
  },
  {
    id: 4,
    category: "Food",
    voucher: "Food Weekend",
    price: 75000,
    validUntil: "2025-02-10",
    minPurchase: 150000,
    maxDiscount: 75000,
    code: "FOODWKND75",
  },
  {
    id: 5,
    category: "Food",
    voucher: "Food Party",
    price: 150000,
    validUntil: "2025-03-01",
    minPurchase: 300000,
    maxDiscount: 150000,
    code: "FOODPARTY150",
  },
  // Car Vouchers
  {
    id: 6,
    category: "Car",
    voucher: "Car",
    price: 100000,
    validUntil: "2025-02-15",
    minPurchase: 500000,
    maxDiscount: 100000,
    code: "CAR100",
  },
  {
    id: 7,
    category: "Car",
    voucher: "Car Premium",
    price: 200000,
    validUntil: "2025-02-20",
    minPurchase: 800000,
    maxDiscount: 200000,
    code: "CARPREM200",
  },
  {
    id: 8,
    category: "Car",
    voucher: "Car Weekly",
    price: 500000,
    validUntil: "2025-03-15",
    minPurchase: 1500000,
    maxDiscount: 500000,
    code: "CARWEEK500",
  },
  {
    id: 9,
    category: "Car",
    voucher: "Car Family",
    price: 300000,
    validUntil: "2025-04-01",
    minPurchase: 1000000,
    maxDiscount: 300000,
    code: "CARFAM300",
  },
  // Bike Vouchers
  {
    id: 10,
    category: "Bike",
    voucher: "Bike",
    price: 25000,
    validUntil: "2025-03-20",
    minPurchase: 50000,
    maxDiscount: 25000,
    code: "BIKE25",
  },
  {
    id: 11,
    category: "Bike",
    voucher: "Bike Daily",
    price: 35000,
    validUntil: "2025-03-25",
    minPurchase: 70000,
    maxDiscount: 35000,
    code: "BIKEDAY35",
  },
  {
    id: 12,
    category: "Bike",
    voucher: "Bike Sport",
    price: 50000,
    validUntil: "2025-04-10",
    minPurchase: 100000,
    maxDiscount: 50000,
    code: "BIKESPORT50",
  },
  {
    id: 13,
    category: "Bike",
    voucher: "Bike Tour",
    price: 75000,
    validUntil: "2025-04-15",
    minPurchase: 150000,
    maxDiscount: 75000,
    code: "BIKETOUR75",
  },
  {
    id: 14,
    category: "Bike",
    voucher: "Bike Weekend",
    price: 40000,
    validUntil: "2025-04-20",
    minPurchase: 80000,
    maxDiscount: 40000,
    code: "BIKEWKND40",
  },
  {
    id: 15,
    category: "Bike",
    voucher: "Bike Group",
    price: 100000,
    validUntil: "2025-05-01",
    minPurchase: 200000,
    maxDiscount: 100000,
    code: "BIKEGROUP100",
  },
  {
    id: 16,
    category: "Bike",
    voucher: "Bike Premium",
    price: 150000,
    validUntil: "2025-05-15",
    minPurchase: 300000,
    maxDiscount: 150000,
    code: "BIKEPREM150",
  },
];

const seedVouchers = async () => {
  try {
    // Ensure all voucher codes are uppercase
    const vouchersWithUpperCodes = voucherData.map((voucher) => ({
      ...voucher,
      code: voucher.code.toUpperCase(),
    }));

    await GlobalVoucher.bulkCreate(vouchersWithUpperCodes);
    console.log("Global vouchers seeded successfully");
  } catch (error) {
    console.error("Error seeding global vouchers:", error);
  }
};

seedVouchers();

module.exports = seedVouchers;
