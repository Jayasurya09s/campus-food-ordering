export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin123";

export const SAMPLE_FOODS = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 299,
    rating: 4.8,
    image: "🍕",
    description: "Classic pizza with fresh mozzarella and basil",
    category: "Pizza",
    available: true,
  },
  {
    id: 2,
    name: "Cheese Burger",
    price: 199,
    rating: 4.5,
    image: "🍔",
    description: "Juicy beef patty with melted cheese",
    category: "Burgers",
    available: true,
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    price: 249,
    rating: 4.6,
    image: "🍝",
    description: "Creamy pasta with bacon and parmesan",
    category: "Pasta",
    available: true,
  },
  {
    id: 4,
    name: "Grill Sandwich",
    price: 149,
    rating: 4.3,
    image: "🥪",
    description: "Toasted sandwich with grilled vegetables",
    category: "Sandwiches",
    available: true,
  },
  {
    id: 5,
    name: "Cold Coffee",
    price: 99,
    rating: 4.7,
    image: "☕",
    description: "Iced coffee with whipped cream",
    category: "Beverages",
    available: true,
  },
];

export const PAYMENT_METHODS = [
  { id: "credit_card", name: "Credit Card" },
  { id: "debit_card", name: "Debit Card" },
  { id: "upi", name: "UPI" },
  { id: "wallet", name: "Wallet" },
];

export const ORDER_STATUSES = [
  { label: "Pending", color: "bg-yellow-100 text-yellow-800", badge: "warning" },
  { label: "Confirmed", color: "bg-blue-100 text-blue-800", badge: "info" },
  { label: "Preparing", color: "bg-purple-100 text-purple-800", badge: "processing" },
  { label: "Delivered", color: "bg-green-100 text-green-800", badge: "success" },
  { label: "Cancelled", color: "bg-red-100 text-red-800", badge: "error" },
];
