// customizationData.js

// --- 1. General Ingredient/Topping Data (Price in cents) ---
export const allIngredients = [
    // --- Burger/Wrap Toppings/Veggies/Sauces ---
    { id: "cheese", name: "Extra Cheese", price: 100, emoji: "🧀", category: "Toppings" },
    { id: "bacon", name: "Crispy Bacon", price: 150, emoji: "🥓", category: "Toppings" },
    { id: "lettuce", name: "Fresh Lettuce", price: 0, emoji: "🥬", category: "Veggies" },
    { id: "tomato", name: "Sliced Tomato", price: 0, emoji: "🍅", category: "Veggies" },
    { id: "onion", name: "Onion Rings", price: 50, emoji: "🧅", category: "Veggies" },
    { id: "pickle", name: "Pickles", price: 0, emoji: "🥒", category: "Veggies" },
    { id: "ketchup", name: "Ketchup", price: 0, emoji: "🍅", category: "Sauces" },
    { id: "mayo", name: "Mayo", price: 0, emoji: "🥚", category: "Sauces" },
    { id: "bbq", name: "BBQ Sauce", price: 30, emoji: "🍖", category: "Sauces" },
    { id: "spicy", name: "Spicy Sauce", price: 30, emoji: "🌶️", category: "Sauces" },
    
    // --- Salad & Wrap Specific ---
    { id: "avocado", name: "Fresh Avocado", price: 150, emoji: "🥑", category: "SaladVeggies" },
    { id: "croutons", name: "Croutons", price: 0, emoji: "🍞", category: "SaladVeggies" },
    { id: "eggs", name: "Hard Boiled Egg", price: 100, emoji: "🥚", category: "SaladProtein" },
    
    // --- Side Dips ---
    { id: "ranchdip", name: "Ranch Dip", price: 50, emoji: "🥣", category: "Dips" },
    { id: "honey", name: "Honey Mustard", price: 50, emoji: "🍯", category: "Dips" },
    { id: "cheesesauce", name: "Cheese Sauce", price: 75, emoji: "🧀", category: "Dips" },

    // --- Salad Dressings (Free or charged if expensive) ---
    { id: "ranch", name: "Ranch", price: 0, emoji: "🥣", category: "Dressings" },
    { id: "balsamic", name: "Balsamic Vinaigrette", price: 0, emoji: "🌿", category: "Dressings" },
    { id: "chipotle", name: "Chipotle Ranch", price: 50, emoji: "🌶️", category: "Dressings" },
    { id: "caesar", name: "Caesar", price: 0, emoji: "👑", category: "Dressings" },

    // --- Drink Options ---
    { id: "noice", name: "No Ice", price: 0, emoji: "🧊", category: "DrinkOptions" },
    { id: "sugarfree", name: "Sugar-Free Syrup", price: 0, emoji: "🍬", category: "DrinkOptions" },
];

// --- 2. Combo/Size Options (Multipliers) ---
const comboSizes = [
  { id: "regular", name: "Regular", multiplier: 1, description: "Standard size" },
  { id: "medium", name: "Medium", multiplier: 1.3, description: "+Fries & Drink" },
  { id: "large", name: "Large", multiplier: 1.6, description: "+Large Fries & Large Drink" },
];

// --- 3. Default Configuration (Defined First to Avoid ESLint Warning) ---
// This template is used for items with no customization, like Desserts.
const defaultConfig = {
    sections: [],
};


// --- 4. Final Category-Specific Configuration ---
export const customizationConfig = {
    // --- BURGERS ---
    'Burgers': {
        sections: [
            { 
                title: "Combo Size", 
                subtitle: "Upgrade for a complete meal deal", 
                type: "single_select",
                key: "comboSize",
                options: comboSizes,
                default: "regular"
            },
            {
                title: "Toppings & Veggies",
                subtitle: "Add extra or remove default items",
                type: "multi_select",
                key: "toppings",
                ingredients: allIngredients.filter(i => i.category === 'Toppings' || i.category === 'Veggies'),
                defaultSelected: ["lettuce", "tomato", "ketchup"] // Standard items included by default
            },
            {
                title: "Sauces",
                subtitle: "Customize your sauce load",
                type: "multi_select",
                key: "sauces",
                ingredients: allIngredients.filter(i => i.category === 'Sauces'),
                defaultSelected: []
            }
        ],
    },

    // --- WRAPS ---
    'Wraps': {
        sections: [
            {
                title: "Sauces & Dressings",
                subtitle: "Choose your flavor base",
                type: "multi_select",
                key: "wrapSauces",
                ingredients: allIngredients.filter(i => i.category === 'Sauces'), 
                defaultSelected: ["mayo"] // Assuming a base mayo
            },
            {
                title: "Add-ons & Removals",
                subtitle: "Adjust your wrap fillings",
                type: "multi_select",
                key: "wrapFillings",
                ingredients: allIngredients.filter(i => i.category === 'Veggies' || i.category === 'Toppings'),
                defaultSelected: ["lettuce", "tomato"] 
            }
        ],
    },

    // --- SALADS ---
    'Salads': {
        sections: [
            {
                title: "Dressing Choice",
                subtitle: "Select one or more dressings",
                type: "multi_select", 
                key: "saladDressing",
                ingredients: allIngredients.filter(i => i.category === 'Dressings'),
                defaultSelected: ["balsamic"] 
            },
            {
                title: "Toppings & Extras",
                subtitle: "Customize salad ingredients",
                type: "multi_select",
                key: "saladExtras",
                ingredients: allIngredients.filter(i => i.category === 'SaladVeggies' || i.category === 'SaladProtein'),
                defaultSelected: ["croutons"]
            }
        ],
    },
    
    // --- SIDES ---
    'Sides': {
        sections: [
            {
                title: "Dipping Sauces",
                subtitle: "Choose your side sauces (Max 2 Free)",
                type: "multi_select",
                key: "dips",
                ingredients: allIngredients.filter(i => i.category === 'Dips'),
                defaultSelected: []
            }
        ],
    },

    // --- DRINKS ---
    'Drinks': {
        sections: [
            {
                title: "Drink Preference",
                subtitle: "Ice and sweetness levels",
                type: "multi_select",
                key: "drinkPref",
                ingredients: allIngredients.filter(i => i.category === 'DrinkOptions'),
                defaultSelected: []
            }
        ],
    },

    // --- NON-CUSTOMIZABLE FALLBACKS ---
    'Default': defaultConfig,
    'Kids Meal': defaultConfig,
    'Desserts': defaultConfig,
    'Specials': defaultConfig,
};