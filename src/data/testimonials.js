import { items } from "./menu";

/**
 * REAL GOOGLE REVIEWS, transcribed verbatim.
 *
 * Quotes are reproduced exactly as written — including the reviewers' own
 * typos, emoji and the one mild criticism in Meenal Vadke's. Do not tidy
 * them: an edited review is no longer that person's review, and a wall of
 * uniformly polished prose is the first thing that reads as fake.
 *
 * `date` holds Google's relative label as it appeared when captured
 * (August 2026). Those drift — "a month ago" will read wrong in a year.
 * When you refresh these, re-capture the labels at the same time, or switch
 * the field to an absolute month.
 *
 *   feature: true  → given a double-width card on the reviews page
 *
 * The first entry is the lead quote on /testimonials and leads the homepage
 * trio, so keep a strong, specific one at the top.
 */

export const testimonials = [
  {
    id: "javier-king",
    quote:
      "Food was amazing. Had the Peri Peri chicken wings. Some of the best wings I've had in a while. The chicken biryani was so fresh and plenty to share. Spicy! It comes minimum spice level medium. The garlic naan was also quite delicious with the hummus. Can't forget the tasty IPA's and the robots delivering you food to the table.",
    name: "Javier King",
    credit: "Local Guide · 22 reviews",
    visit: "Dine in · Lunch · $20–30",
    rating: 5,
    date: "4 months ago",
  },
  {
    id: "drew-hazlett",
    quote:
      "Many large tvs ensure that no matter where you sit you get an excellent view of them. The pool hall is inviting and friendly. The servers are inviting and very helpful navigating the vast menu full of excellent food (thank you Sam!). And the food is excellent. After our first visit, we haven't gone a week without returning.",
    name: "Drew Hazlett",
    credit: "Local Guide · 9 reviews",
    visit: "Dine in · $20–30",
    rating: 5,
    date: "a month ago",
  },
  {
    id: "hema-b",
    quote:
      "We had a wonderful experience! The food was absolutely delicious—fresh, flavorful, and beautifully prepared. A special thank you to our server, Vyesh, who was incredibly friendly, attentive, and made us feel so welcome throughout our meal. Her warm smile and excellent service truly made our dining experience even better. We'll definitely be back!",
    name: "Hema B",
    credit: "7 reviews",
    visit: "Dinner · $20–30",
    rating: 5,
    date: "4 weeks ago",
  },
  {
    id: "jane-white",
    quote:
      "An excellent place to meet up with friends, to eat and entertainment. If you like spicy 🌶 food this is the place for you but be careful I couldn't handle medium spicy which I thought it was definitely a hot level. My pores opened on my face and water steamed out, along with a runny nose and tearing eyes. My ears were popping and I wasn't alone in having this experience but above all the food was delicious.",
    name: "Dr. Jane White",
    credit: "Local Guide · 229 reviews",
    visit: "Dine in · Dinner · $60–70",
    rating: 5,
    date: "4 months ago",
    feature: true,
  },
  {
    id: "d",
    quote:
      "This is one of my favorite Indian restaurants!!! Vijju was our server and was excellent. They also serve food with robots! I go to all the Indian places and this hits the spot every time! The chicken tikka masala, vegetable korma, butter naan, also the naan with raisin and nuts is phenomenal! 10/10 food and service! YUM!!!!",
    name: "D",
    credit: "Local Guide · 9 reviews",
    rating: 5,
    date: "a year ago",
    feature: true,
  },
  {
    id: "sam-c",
    quote:
      "Wow! The mango chicken curry at medium heat was perfect <3 the garlic naan is amazing!!! Very good food. We loved the robot waiter ;) I usually post pictures but we started digging in and forgot. XD Thank you",
    name: "Sam C",
    credit: "Local Guide · 25 reviews",
    visit: "Lunch · $20–30",
    rating: 5,
    date: "4 weeks ago",
  },
  {
    id: "manus-hand",
    quote:
      "The food was delicious. We went with a friend who is from India and knows where the best Indian food is — irs here. Authentic, delicious, very comfortable, and did I say delicious? Samuel took great care of us and we left so very full and happy.",
    name: "Manus Hand",
    credit: "5 reviews",
    rating: 5,
    date: "a year ago",
  },
  {
    id: "benjamin-kite",
    quote:
      "The food was amazing! The prices were more than fair, the wait staff were friendly, attentive and positive. The pool tables are top notch and plentiful. The atmosphere was alive, vibrant and clean! Can't wait to get back to Paradise Tavern for a fun night of pool, with amazing food and drinks at a more than fair price. Keep up the good work PT",
    name: "Benjamin Kite",
    credit: "10 reviews",
    rating: 5,
    date: "6 months ago",
    feature: true,
  },
  {
    id: "elizabeth-johnson",
    quote:
      "Paradise Tavern is a great place to come eat! The food is diverse, and everything I've tried is delicious. The staff (especially Sam) are friendly, and I've eaten here almost every week for the past month. The food is delivered quickly, and are good sized portions as well.",
    name: "Elizabeth Johnson",
    credit: "3 reviews",
    visit: "Dine in · $20–30",
    rating: 5,
    date: "a month ago",
  },
  {
    id: "aditi-dharpawar",
    quote:
      "The food was really amazing. We really like the Amritsari Fish and chicken Tandoori. Perfect spice level. Sam was very prompt at service.",
    name: "Aditi Dharpawar",
    credit: "2 reviews",
    visit: "Dine in · $20–30",
    rating: 5,
    date: "a month ago",
  },
  {
    id: "roxanne-lennick",
    quote:
      "I had the Paradise special veg Thalia my husband had the non veg Thali. We really enjoyed the variety and flavors of the dishes. Sam our waiter was amazing telling us about each dish. Great atmosphere with huge bar and TVs to watch the games.",
    name: "Roxanne Lennick",
    credit: "3 reviews",
    visit: "Dine in",
    rating: 5,
    date: "4 months ago",
  },
  {
    id: "big-mic",
    quote:
      "A sports bar... That serves Indian food... And great Indian food at that. If you like spicy don't be afraid to get the spiciest, all levels had great flavor but was very tame heat wise. Tons of TV's. Tons of pool table's.",
    name: "Big Mic",
    credit: "Local Guide · 749 reviews",
    visit: "Dine in · Dinner · $30–50",
    rating: 5,
    date: "10 months ago",
  },
  {
    id: "meenal-vadke",
    quote:
      "Indian sports bar vibe. When we went there was a group singing karaoke, few sang really well. Enjoyed that Biryani was Indian hot. Dosa and spring rolls were nice. PaniPuri, I wasn't impressed.",
    name: "Meenal Vadke",
    credit: "Local Guide · 220 reviews",
    visit: "Dine in · Dinner · $20–30",
    rating: 5,
    date: "9 months ago",
  },
  {
    id: "giulia-zanella",
    quote:
      "We came here for a Too Good To Go, but we sat down while they were making it. They were having a happy hour and there is so much to choose from and the prices are so good! We might come back again for this offer and get some good too! The food they have us was delicious!",
    name: "Giulia Zanella",
    credit: "Local Guide · 388 reviews",
    visit: "Other · $1–10",
    rating: 5,
    date: "a month ago",
  },
];

/**
 * Lines from the restaurant's own printed menu — not press coverage, and
 * labelled as such. These replaced three invented quotes that had been
 * attributed to real publications.
 */
export const pressQuotes = [
  { quote: "Raising the bar, one jig at a time", source: "Crafted Concoctions" },
  { quote: "With a great brand name comes the great taste", source: "Paradise" },
  { quote: "Signature biryanis, Mughlai and tandoor", source: "Since the beginning" },
  { quote: "What goes better with liquor and beer than Indian food?", source: "Paradise Tavern" },
];

/**
 * Every figure below comes from the restaurant's own printed menu
 * (menu-source, page 1 and page 18) or is computed from the menu data.
 * Nothing here is invented — check the print before changing one.
 */
export const stats = [
  { value: "44", label: "Locations", detail: "across the United States" },
  { value: "16", label: "States", detail: "and counting" },
  { value: "12/10", label: "Hottest on our scale", detail: "the Challenge level" },
  { value: String(items.length), label: "Dishes", detail: "on the full menu" },
];
