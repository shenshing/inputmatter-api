import { DataSource } from 'typeorm';
import { Shop } from '../../shop/shop.entity';
import { Feedback } from '../../feedback/feedback.entity';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'local'}` });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [Shop, Feedback],
  synchronize: false,
});

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const feedbackData: Array<{
  shop_name: string;
  description: string;
  categories: string[];
  daysAgo: number;
}> = [
  // Tube Coffee (BKK)
  { shop_name: 'Tube Coffee (BKK)', description: 'Amazing single-origin pour over. The barista took time to explain the flavor notes and it tasted exactly as described — bright and fruity.', categories: ['taste', 'service'], daysAgo: 2 },
  { shop_name: 'Tube Coffee (BKK)', description: 'The space is tiny but very cozy. Loved the minimalist vibe. Coffee was excellent.', categories: ['environment', 'taste'], daysAgo: 5 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Waited 20 minutes for a latte during peak hours. Staff seemed overwhelmed. Coffee was good though.', categories: ['service', 'taste'], daysAgo: 9 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Best cold brew in Bangkok hands down. Smooth and not bitter at all. Will be back every week.', categories: ['taste'], daysAgo: 14 },
  { shop_name: 'Tube Coffee (BKK)', description: 'The staff recommended a natural Ethiopian and it blew my mind. Great knowledge and very friendly.', categories: ['service', 'taste'], daysAgo: 20 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Nice spot but the seating is limited. Had to stand for 30 minutes on a Sunday morning.', categories: ['environment'], daysAgo: 27 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Ordered online and picked up in 10 minutes. Super smooth process. Coffee was on point.', categories: ['service', 'taste'], daysAgo: 33 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Cappuccino was perfectly balanced. Microfoam was silky. One of the best in the city.', categories: ['taste'], daysAgo: 41 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Got the wrong order twice. Staff were apologetic but it was a bit frustrating.', categories: ['service'], daysAgo: 48 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Lovely afternoon here with a cortado and a book. The ambient music was just right.', categories: ['environment', 'taste'], daysAgo: 55 },
  { shop_name: 'Tube Coffee (BKK)', description: 'They ran out of oat milk at 10am. Not ideal. The drip coffee was fine but I wanted a latte.', categories: ['service', 'other'], daysAgo: 62 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Really impressed by the seasonal menu. They rotate beans monthly which keeps things exciting.', categories: ['taste', 'other'], daysAgo: 70 },

  // Brown Roastery TK
  { shop_name: 'Brown Roastery TK', description: 'The house blend espresso is incredible. Rich, chocolatey, and perfect crema every time.', categories: ['taste'], daysAgo: 3 },
  { shop_name: 'Brown Roastery TK', description: 'Great roastery vibe. You can see the roasting machine through the glass which is super cool.', categories: ['environment'], daysAgo: 7 },
  { shop_name: 'Brown Roastery TK', description: 'Staff was very helpful in choosing beans to take home. Bought 250g of the Colombia washed and it is fantastic.', categories: ['service', 'taste'], daysAgo: 11 },
  { shop_name: 'Brown Roastery TK', description: 'Tried the nitro cold brew for the first time here. So smooth and creamy without any milk.', categories: ['taste'], daysAgo: 16 },
  { shop_name: 'Brown Roastery TK', description: 'The seating area could use better AC. It was quite hot inside during the afternoon.', categories: ['environment'], daysAgo: 22 },
  { shop_name: 'Brown Roastery TK', description: 'Genuinely one of the best flat whites I have had in Thailand. Excellent milk texture.', categories: ['taste'], daysAgo: 29 },
  { shop_name: 'Brown Roastery TK', description: 'Busy on weekends but the queue moves fast. Baristas are efficient and skilled.', categories: ['service', 'environment'], daysAgo: 36 },
  { shop_name: 'Brown Roastery TK', description: 'The retail section has great selection but prices for beans are a bit steep.', categories: ['other'], daysAgo: 43 },
  { shop_name: 'Brown Roastery TK', description: 'Love that they offer brew method options — V60, Aeropress, or batch. Nice touch.', categories: ['service', 'taste'], daysAgo: 50 },
  { shop_name: 'Brown Roastery TK', description: 'Free wifi is very slow. Not a great spot for remote work despite the nice tables.', categories: ['environment', 'other'], daysAgo: 58 },
  { shop_name: 'Brown Roastery TK', description: 'Americano was served too hot and had to wait ages for it to cool. Minor complaint overall.', categories: ['taste', 'service'], daysAgo: 65 },
  { shop_name: 'Brown Roastery TK', description: 'Monthly coffee subscription they offer is great value. Fresh roasted delivered to my door.', categories: ['other', 'taste'], daysAgo: 73 },

  // Blue Bottle Coffee
  { shop_name: 'Blue Bottle Coffee', description: 'The iconic Blue Bottle quality lives up to the hype in Bangkok. New Orleans iced coffee is a must try.', categories: ['taste'], daysAgo: 1 },
  { shop_name: 'Blue Bottle Coffee', description: 'Very Instagram-worthy interior but the prices are quite high for what you get.', categories: ['environment', 'other'], daysAgo: 6 },
  { shop_name: 'Blue Bottle Coffee', description: 'Baristas are trained to perfection. My single origin pour over was done with such care.', categories: ['service', 'taste'], daysAgo: 12 },
  { shop_name: 'Blue Bottle Coffee', description: 'The cafe is always spotlessly clean. Feels premium from the moment you walk in.', categories: ['environment'], daysAgo: 18 },
  { shop_name: 'Blue Bottle Coffee', description: 'Long queue during lunch hour and only two registers open. Took 25 minutes just to order.', categories: ['service'], daysAgo: 24 },
  { shop_name: 'Blue Bottle Coffee', description: 'Matcha latte was beautifully made. The Blue Bottle matcha is different from competitors — more umami.', categories: ['taste'], daysAgo: 31 },
  { shop_name: 'Blue Bottle Coffee', description: 'Staff explained their sourcing story clearly. Really appreciate that transparency about the beans.', categories: ['service', 'other'], daysAgo: 38 },
  { shop_name: 'Blue Bottle Coffee', description: 'No power outlets for laptops. Not a place to work but great for a quick coffee break.', categories: ['environment', 'other'], daysAgo: 45 },
  { shop_name: 'Blue Bottle Coffee', description: 'The almond milk option was not available today. Ended up with regular milk which was fine.', categories: ['service', 'other'], daysAgo: 52 },
  { shop_name: 'Blue Bottle Coffee', description: 'Croissant paired with a Gibraltar was a perfect morning combo. Both outstanding quality.', categories: ['taste'], daysAgo: 60 },
  { shop_name: 'Blue Bottle Coffee', description: 'The outdoor seating gets noisy from the street. Inside is much better ambiance.', categories: ['environment'], daysAgo: 68 },
  { shop_name: 'Blue Bottle Coffee', description: 'A bit pricey but worth it occasionally as a treat. The attention to detail is impressive.', categories: ['taste', 'other'], daysAgo: 76 },

  // Starbucks Reserve
  { shop_name: 'Starbucks Reserve', description: 'The Reserve experience is on another level. Tried the Clover brewed single origin and it was exceptional.', categories: ['taste', 'service'], daysAgo: 2 },
  { shop_name: 'Starbucks Reserve', description: 'Beautiful space with the big copper machines. Very photogenic and the staff loves to show off the equipment.', categories: ['environment', 'service'], daysAgo: 8 },
  { shop_name: 'Starbucks Reserve', description: 'Reserve drinks are much better than regular Starbucks. The espresso martini cocktail was a highlight.', categories: ['taste'], daysAgo: 13 },
  { shop_name: 'Starbucks Reserve', description: 'Staff gave us a guided tasting experience which was very educational and fun.', categories: ['service'], daysAgo: 19 },
  { shop_name: 'Starbucks Reserve', description: 'Reservations recommended on weekends. We waited nearly 30 minutes for a table.', categories: ['service', 'environment'], daysAgo: 25 },
  { shop_name: 'Starbucks Reserve', description: 'The small plates food menu surprised me. The avocado toast and coffee pairing recommendation was spot on.', categories: ['taste', 'service'], daysAgo: 32 },
  { shop_name: 'Starbucks Reserve', description: 'Pricy but justified for the premium ingredients and presentation. Great for special occasions.', categories: ['taste', 'other'], daysAgo: 39 },
  { shop_name: 'Starbucks Reserve', description: 'Air conditioning is extremely cold. Bring a jacket if you plan to sit for a while.', categories: ['environment'], daysAgo: 47 },
  { shop_name: 'Starbucks Reserve', description: 'Ordered the Reserve cold foam drink and was disappointed — it tasted like regular Starbucks.', categories: ['taste'], daysAgo: 54 },
  { shop_name: 'Starbucks Reserve', description: 'The loyalty app works seamlessly here and you still earn stars. Love that they kept that.', categories: ['other', 'service'], daysAgo: 61 },
  { shop_name: 'Starbucks Reserve', description: 'Barista walked us through all the brewing methods on display. Really elevated the experience.', categories: ['service', 'taste'], daysAgo: 69 },
  { shop_name: 'Starbucks Reserve', description: 'Clover machine coffee was way too hot. Asked for it to be remade and they were happy to do so.', categories: ['taste', 'service'], daysAgo: 77 },

  // The Coffee Club
  { shop_name: 'The Coffee Club', description: 'Classic and reliable. The house blend latte is consistently good no matter which branch you go to.', categories: ['taste'], daysAgo: 4 },
  { shop_name: 'The Coffee Club', description: 'Service can be a bit slow but the staff are always friendly and welcoming.', categories: ['service'], daysAgo: 9 },
  { shop_name: 'The Coffee Club', description: 'Brunch menu is excellent. The eggs benedict paired with a flat white made my Sunday.', categories: ['taste', 'service'], daysAgo: 15 },
  { shop_name: 'The Coffee Club', description: 'Always clean and well organized. Good family-friendly environment with plenty of seating.', categories: ['environment'], daysAgo: 21 },
  { shop_name: 'The Coffee Club', description: 'The iced coffee here has gotten sweeter than I remember. Would prefer less sugar by default.', categories: ['taste'], daysAgo: 28 },
  { shop_name: 'The Coffee Club', description: 'Birthday cake slice was delicious and staff sang happy birthday spontaneously. Great experience.', categories: ['service', 'other'], daysAgo: 35 },
  { shop_name: 'The Coffee Club', description: 'Decent wifi speed and enough power sockets. A solid place to work for a few hours.', categories: ['environment', 'other'], daysAgo: 42 },
  { shop_name: 'The Coffee Club', description: 'The all-day breakfast is great value. Good coffee, big portions, fair price.', categories: ['taste', 'other'], daysAgo: 49 },
  { shop_name: 'The Coffee Club', description: 'Staff forgot my food order and I had to remind them after 30 minutes. Not great.', categories: ['service'], daysAgo: 56 },
  { shop_name: 'The Coffee Club', description: 'Consistent quality across multiple visits. My go-to cafe when I want something reliable.', categories: ['taste', 'service'], daysAgo: 64 },
  { shop_name: 'The Coffee Club', description: 'Love the seasonal drinks they add to the menu. The caramel pumpkin latte was really well done.', categories: ['taste', 'other'], daysAgo: 72 },
  { shop_name: 'The Coffee Club', description: 'Background music is always too loud for conversations. Wish they turned it down a notch.', categories: ['environment'], daysAgo: 80 },

  // Café Amazon
  { shop_name: 'Café Amazon', description: 'Great value for money. For the price you cannot go wrong — the coffee is solid and consistent.', categories: ['taste', 'other'], daysAgo: 1 },
  { shop_name: 'Café Amazon', description: 'Super fast service during my drive-through visit. Under 3 minutes from order to cup. Impressive.', categories: ['service'], daysAgo: 5 },
  { shop_name: 'Café Amazon', description: 'The green Amazon iced coffee is my daily ritual. Affordable and tasty every single time.', categories: ['taste'], daysAgo: 10 },
  { shop_name: 'Café Amazon', description: 'The promotion offer for 2 drinks at 99 baht is unbeatable. Brought my colleague and we were both happy.', categories: ['other', 'taste'], daysAgo: 16 },
  { shop_name: 'Café Amazon', description: 'Some locations look a bit tired and need renovation. The one near my office could use a refresh.', categories: ['environment'], daysAgo: 23 },
  { shop_name: 'Café Amazon', description: 'The app-based ordering is convenient but it crashed on me twice this week. Needs improvement.', categories: ['other', 'service'], daysAgo: 30 },
  { shop_name: 'Café Amazon', description: 'Staff are always cheerful and greet you with a smile. That alone keeps me coming back.', categories: ['service'], daysAgo: 37 },
  { shop_name: 'Café Amazon', description: 'Iced caramel macchiato is my go-to. They make it sweet enough without being overwhelming.', categories: ['taste'], daysAgo: 44 },
  { shop_name: 'Café Amazon', description: 'New branch near my condo is sparkling clean with modern interiors. Well done on the upgrade.', categories: ['environment'], daysAgo: 51 },
  { shop_name: 'Café Amazon', description: 'Bread and pastries are mediocre. Stick to the coffee — that is where Amazon shines.', categories: ['taste', 'other'], daysAgo: 59 },
  { shop_name: 'Café Amazon', description: 'The loyalty stamp card fills up so fast when you come daily. Love the free drink rewards.', categories: ['other', 'service'], daysAgo: 66 },
  { shop_name: 'Café Amazon', description: 'Got the seasonal honey lemon coffee drink and it was refreshing. Good seasonal innovation.', categories: ['taste'], daysAgo: 74 },

  // Roots Coffee Roaster
  { shop_name: 'Roots Coffee Roaster', description: 'Roots is a Bangkok institution for specialty coffee. The Ethiopia Yirgacheffe they serve is extraordinary.', categories: ['taste'], daysAgo: 3 },
  { shop_name: 'Roots Coffee Roaster', description: 'The team really knows their craft. Had a fascinating conversation about fermentation methods with the barista.', categories: ['service', 'taste'], daysAgo: 7 },
  { shop_name: 'Roots Coffee Roaster', description: 'Beautiful industrial space with warm lighting. One of the most comfortable cafes to spend an afternoon in.', categories: ['environment'], daysAgo: 13 },
  { shop_name: 'Roots Coffee Roaster', description: 'Brewed coffee options are extensive. Loved that they offer both washed and natural from the same origin.', categories: ['taste', 'other'], daysAgo: 19 },
  { shop_name: 'Roots Coffee Roaster', description: 'A bit out of the way but always worth the trip. The quality justifies the journey.', categories: ['other', 'environment'], daysAgo: 26 },
  { shop_name: 'Roots Coffee Roaster', description: 'Staff can be a bit pretentious if you ask beginner questions. Would appreciate more warmth.', categories: ['service'], daysAgo: 33 },
  { shop_name: 'Roots Coffee Roaster', description: 'Bought a 500g bag of their house espresso blend and it is perfect for home brewing. Highly recommend.', categories: ['taste', 'other'], daysAgo: 40 },
  { shop_name: 'Roots Coffee Roaster', description: 'The tasting flight of three coffees was excellent and educational. Great way to explore their range.', categories: ['taste', 'service'], daysAgo: 47 },
  { shop_name: 'Roots Coffee Roaster', description: 'No background music makes the space peaceful and focused. Perfect for reading or working.', categories: ['environment'], daysAgo: 54 },
  { shop_name: 'Roots Coffee Roaster', description: 'Espresso extraction here is dialed in perfectly. You can taste the difference from average cafes.', categories: ['taste'], daysAgo: 62 },
  { shop_name: 'Roots Coffee Roaster', description: 'Got cold brew on tap and it was some of the best I have had — silky, clean, and complex.', categories: ['taste'], daysAgo: 70 },
  { shop_name: 'Roots Coffee Roaster', description: 'Limited seating means it gets full quickly on weekends. Come early or expect to wait.', categories: ['environment', 'other'], daysAgo: 78 },

  // Graph Café
  { shop_name: 'Graph Café', description: 'The signature graph latte art is genuinely impressive. Taste matches the looks — excellent espresso base.', categories: ['taste', 'service'], daysAgo: 2 },
  { shop_name: 'Graph Café', description: 'Very trendy spot. The interior is Instagrammable without feeling forced. Tasteful design.', categories: ['environment'], daysAgo: 6 },
  { shop_name: 'Graph Café', description: 'The baristas here are clearly passionate about coffee. You can feel the energy when you walk in.', categories: ['service', 'taste'], daysAgo: 11 },
  { shop_name: 'Graph Café', description: 'Signature iced drinks are creative and delicious. The sparkling coffee with yuzu was a revelation.', categories: ['taste'], daysAgo: 17 },
  { shop_name: 'Graph Café', description: 'Seating area is cozy but it gets smoky near the entrance when people linger outside.', categories: ['environment'], daysAgo: 24 },
  { shop_name: 'Graph Café', description: 'Had to wait 15 minutes just to get a table on a Saturday. The place is very popular.', categories: ['service', 'environment'], daysAgo: 31 },
  { shop_name: 'Graph Café', description: 'Staff remembered my usual order after just two visits. That personal touch means a lot.', categories: ['service'], daysAgo: 38 },
  { shop_name: 'Graph Café', description: 'The single origin offerings change weekly. Always exciting to see what they have sourced next.', categories: ['taste', 'other'], daysAgo: 46 },
  { shop_name: 'Graph Café', description: 'Latte was a bit bitter on my last visit. Usually very good but had an off day it seems.', categories: ['taste'], daysAgo: 53 },
  { shop_name: 'Graph Café', description: 'Great playlist every time I come. Music curation here is seriously on point.', categories: ['environment'], daysAgo: 60 },
  { shop_name: 'Graph Café', description: 'The drip coffee menu is rotating and seasonal. Love that they push customers to try new things.', categories: ['taste', 'service'], daysAgo: 68 },
  { shop_name: 'Graph Café', description: 'Slightly overpriced for what you get but the atmosphere makes up for it to some degree.', categories: ['other', 'environment'], daysAgo: 76 },

  // Brave Roasters
  { shop_name: 'Brave Roasters', description: 'Truly brave with their flavor profiles. The carbonic maceration gesha was unlike anything I have tasted.', categories: ['taste'], daysAgo: 1 },
  { shop_name: 'Brave Roasters', description: 'One of the friendliest teams in Bangkok specialty coffee. Never felt judged for not knowing the terminology.', categories: ['service'], daysAgo: 5 },
  { shop_name: 'Brave Roasters', description: 'The roastery tours they offer on Saturdays are a fantastic experience. Booked mine a week ahead.', categories: ['service', 'other'], daysAgo: 10 },
  { shop_name: 'Brave Roasters', description: 'Their house espresso is naturally sweet and needs no sugar at all. Perfectly balanced roast.', categories: ['taste'], daysAgo: 16 },
  { shop_name: 'Brave Roasters', description: 'The seating outside is pleasant in the morning but gets too hot by midday. Plan your visit accordingly.', categories: ['environment'], daysAgo: 22 },
  { shop_name: 'Brave Roasters', description: 'Ordered decaf and was surprised by how good it was. Often decaf tastes flat but this was full-bodied.', categories: ['taste'], daysAgo: 29 },
  { shop_name: 'Brave Roasters', description: 'Long wait for pour over is expected here — they take pride in each cup and it shows.', categories: ['service', 'taste'], daysAgo: 36 },
  { shop_name: 'Brave Roasters', description: 'Their online shop ships to my home province which is great. Same quality beans as in-store.', categories: ['other', 'taste'], daysAgo: 43 },
  { shop_name: 'Brave Roasters', description: 'The filter coffee menu is exciting and changes frequently. I try to visit monthly just for this.', categories: ['taste', 'other'], daysAgo: 50 },
  { shop_name: 'Brave Roasters', description: 'Parking is difficult nearby. They should partner with the nearby mall for validation.', categories: ['other', 'environment'], daysAgo: 58 },
  { shop_name: 'Brave Roasters', description: 'The barista competition trophy on display shows the level of seriousness they take here. Impressive.', categories: ['environment', 'other'], daysAgo: 65 },
  { shop_name: 'Brave Roasters', description: 'Got a subscription coffee bag and the freshness is exceptional. Roasted to order, delivered in 2 days.', categories: ['taste', 'other'], daysAgo: 73 },

  // Factory Coffee
  { shop_name: 'Factory Coffee', description: 'The warehouse aesthetic combined with specialty coffee is such a good match. Huge and airy space.', categories: ['environment'], daysAgo: 3 },
  { shop_name: 'Factory Coffee', description: 'Very consistent espresso quality. I come here every weekday before work and it never disappoints.', categories: ['taste'], daysAgo: 7 },
  { shop_name: 'Factory Coffee', description: 'They have a great selection of brewing equipment for sale. Bought a Chemex and the staff helped me pick the right grind size.', categories: ['service', 'other'], daysAgo: 12 },
  { shop_name: 'Factory Coffee', description: 'The batch brew here is surprisingly good. Often overlooked but it is well-extracted and clean.', categories: ['taste'], daysAgo: 18 },
  { shop_name: 'Factory Coffee', description: 'Loud because of the high ceilings — conversations are difficult at peak hours.', categories: ['environment'], daysAgo: 25 },
  { shop_name: 'Factory Coffee', description: 'Very efficient ordering system with a QR menu. Food came out fast and the coffee order was accurate.', categories: ['service', 'other'], daysAgo: 32 },
  { shop_name: 'Factory Coffee', description: 'The cold drip tower is mesmerizing to watch. And the cold drip itself is smooth and clean.', categories: ['taste', 'environment'], daysAgo: 39 },
  { shop_name: 'Factory Coffee', description: 'Restrooms were not clean during my last visit. This should be maintained better.', categories: ['environment'], daysAgo: 46 },
  { shop_name: 'Factory Coffee', description: 'Good for groups — large communal tables make it easy to come with 6 or more people.', categories: ['environment', 'other'], daysAgo: 53 },
  { shop_name: 'Factory Coffee', description: 'The barista championship they hosted was amazing to watch. Great community spirit.', categories: ['service', 'other'], daysAgo: 60 },
  { shop_name: 'Factory Coffee', description: 'Milk-based drinks are well-made but I find the espresso a touch dark for my preference.', categories: ['taste'], daysAgo: 68 },
  { shop_name: 'Factory Coffee', description: 'Great laptop-friendly cafe with strong wifi and multiple power points at most seats.', categories: ['environment', 'other'], daysAgo: 75 },

  // Extra entries — uneven distribution to make data feel real
  // Tube Coffee (BKK) +4
  { shop_name: 'Tube Coffee (BKK)', description: 'The new seasonal latte with Thai tea and espresso was surprisingly good. Really creative menu additions.', categories: ['taste', 'other'], daysAgo: 82 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Barista training is clearly top notch here. Every cup comes out perfectly extracted.', categories: ['taste', 'service'], daysAgo: 88 },
  { shop_name: 'Tube Coffee (BKK)', description: 'Went during a quiet Tuesday morning and had the best experience. No queue, great music, perfect coffee.', categories: ['environment', 'taste'], daysAgo: 95 },
  { shop_name: 'Tube Coffee (BKK)', description: 'They started offering brewing workshops on Sundays. Signed up immediately — the barista was excellent.', categories: ['service', 'other'], daysAgo: 102 },

  // Blue Bottle Coffee +5
  { shop_name: 'Blue Bottle Coffee', description: 'The new single origin from Panama was outstanding. Floral and bright with a clean finish.', categories: ['taste'], daysAgo: 83 },
  { shop_name: 'Blue Bottle Coffee', description: 'Staff turnover seems high lately — service is not as consistent as it used to be.', categories: ['service'], daysAgo: 90 },
  { shop_name: 'Blue Bottle Coffee', description: 'Picked up a drip coffee bag to brew at home. Instructions were clear and the result was excellent.', categories: ['taste', 'other'], daysAgo: 97 },
  { shop_name: 'Blue Bottle Coffee', description: 'The renovation they did made the space feel more open. Much better seating layout now.', categories: ['environment'], daysAgo: 105 },
  { shop_name: 'Blue Bottle Coffee', description: 'Still the most consistent specialty coffee chain I have tried across multiple countries.', categories: ['taste', 'service'], daysAgo: 112 },

  // Café Amazon +6
  { shop_name: 'Café Amazon', description: 'New matcha series they launched is honestly really good for the price point. Impressed.', categories: ['taste', 'other'], daysAgo: 81 },
  { shop_name: 'Café Amazon', description: 'The drive-through lane was backed up for nearly 20 minutes this morning. Need more staff.', categories: ['service'], daysAgo: 86 },
  { shop_name: 'Café Amazon', description: 'Updated their app and it is much smoother now. Ordering ahead and skipping the queue is seamless.', categories: ['other', 'service'], daysAgo: 92 },
  { shop_name: 'Café Amazon', description: 'Consistent across every branch I have visited. That reliability is genuinely impressive at this scale.', categories: ['taste', 'other'], daysAgo: 99 },
  { shop_name: 'Café Amazon', description: 'The cold brew float they added to the summer menu is fantastic and very affordable.', categories: ['taste'], daysAgo: 107 },
  { shop_name: 'Café Amazon', description: 'Staff at my local branch always remember my order. Friendly faces every morning.', categories: ['service'], daysAgo: 115 },

  // Graph Café +4
  { shop_name: 'Graph Café', description: 'The specialty tonic espresso they introduced this month is incredibly refreshing. Perfect for hot days.', categories: ['taste'], daysAgo: 84 },
  { shop_name: 'Graph Café', description: 'Loved the collaboration menu with the local bakery. The pairings were well thought out.', categories: ['taste', 'other'], daysAgo: 91 },
  { shop_name: 'Graph Café', description: 'A bit hard to find parking nearby but once you are inside it is absolutely worth it.', categories: ['environment', 'other'], daysAgo: 98 },
  { shop_name: 'Graph Café', description: 'The staff were very patient explaining the tasting notes. Great for newcomers to specialty coffee.', categories: ['service', 'taste'], daysAgo: 106 },

  // The Coffee Club +3
  { shop_name: 'The Coffee Club', description: 'Upgraded their coffee machine and you can really taste the difference. Extraction is much cleaner now.', categories: ['taste'], daysAgo: 85 },
  { shop_name: 'The Coffee Club', description: 'Perfect for a business meeting — quiet, well-spaced tables, and staff are discreet.', categories: ['environment', 'service'], daysAgo: 93 },
  { shop_name: 'The Coffee Club', description: 'The loyalty app finally got a redesign. Much easier to redeem rewards now.', categories: ['other'], daysAgo: 100 },

  // Brown Roastery TK +2
  { shop_name: 'Brown Roastery TK', description: 'Attended a cupping session here and learned so much. Would love to see these run more regularly.', categories: ['service', 'other'], daysAgo: 80 },
  { shop_name: 'Brown Roastery TK', description: 'The Guatemala natural process they had on filter was one of my favorite coffees this year.', categories: ['taste'], daysAgo: 89 },

  // Roots Coffee Roaster +2
  { shop_name: 'Roots Coffee Roaster', description: 'Their collaboration with a farm in Chiang Rai produced some truly exceptional beans. Highly recommend.', categories: ['taste', 'other'], daysAgo: 87 },
  { shop_name: 'Roots Coffee Roaster', description: 'A bit formal compared to other cafes but the coffee quality makes every visit worthwhile.', categories: ['environment', 'taste'], daysAgo: 96 },

  // Brave Roasters +1
  { shop_name: 'Brave Roasters', description: 'The honey process Bourbon they sourced from El Salvador was extraordinary. Sweet and complex.', categories: ['taste'], daysAgo: 82 },

  // Starbucks Reserve +1
  { shop_name: 'Starbucks Reserve', description: 'The Reserve exclusive bean this quarter is much better than last time. Real improvement in quality.', categories: ['taste', 'other'], daysAgo: 86 },

  // Factory Coffee +2
  { shop_name: 'Factory Coffee', description: 'Tried the guest roaster feature for the first time — a Kenyan from a small local roaster. Brilliant choice.', categories: ['taste', 'other'], daysAgo: 83 },
  { shop_name: 'Factory Coffee', description: 'The new outdoor terrace area they opened is a great addition. Much better on cooler evenings.', categories: ['environment'], daysAgo: 91 },
];

async function seed() {
  await dataSource.initialize();
  const shopRepo = dataSource.getRepository(Shop);
  const feedbackRepo = dataSource.getRepository(Feedback);

  const shops = await shopRepo.find();
  const shopMap = new Map(shops.map((s) => [s.name, s]));

  let seeded = 0;
  for (const item of feedbackData) {
    const shop = shopMap.get(item.shop_name) ?? null;
    const feedback = feedbackRepo.create({
      description: item.description,
      categories: item.categories,
      shop_name: item.shop_name,
      shop,
    });
    feedback.created_at = daysAgo(item.daysAgo);
    feedback.updated_at = feedback.created_at;
    await feedbackRepo.save(feedback);
    seeded++;
  }

  await dataSource.destroy();
  console.log(`Seeding complete. ${seeded} feedback entries inserted.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
