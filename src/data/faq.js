import { site } from "./site";

/**
 * Every answer here comes from the printed menu (page 1 small print, the
 * spice scale and the house rules on the back page) or from site.js.
 * Nothing is invented: if the restaurant changes a policy, change it here.
 */
export const faq = [
  {
    q: "Until what time can I order food?",
    a: "The main menu is served from opening until 9:45 PM every day. After 9:45 PM, food is ordered from the All Time Menu until close. Full opening hours are listed just above.",
  },
  {
    q: "Do you take reservations?",
    a: `Yes. Book a table online through our reservations page, or call us on ${site.phone}.`,
  },
  {
    q: "How spicy is “medium”?",
    a: "Our kitchen works to an eight-step house spice scale, from Very Mild (1/10) up to Challenge (12/10). Medium is 6/10, with Paradise signature spices added. Dishes ordered medium to challenge cannot be returned for being too spicy, so if you are unsure, start at mild to medium.",
  },
  {
    q: "I have a food allergy. Can you accommodate it?",
    a: "Please tell your server when you order. Our dishes may contain milk, egg, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy and sesame, and we will do our best to accommodate any changes you need. The menu marks dishes that are gluten-free, nut-free, dairy-free, vegetarian and vegan.",
  },
  {
    q: "Is there a service charge for large groups?",
    a: "Parties of six or more guests are charged a 20% gratuity on pre-discounted totals. Split checks need to be requested before the order is placed.",
  },
  {
    q: "Does happy hour apply to takeout?",
    a: "No. Happy hour is valid for dine-in orders only, and offers cannot be combined with other promotions.",
  },
  {
    q: "Where can I see the full drinks list?",
    a: "The draught, bottled beer, whiskey, tequila, vodka and wine lists are in the printed menu, pages 2 to 4. You can flip through every page of it on our menu page.",
  },
];
