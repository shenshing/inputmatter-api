import { seedShopBrands, ShopBrand } from './shop-brand-seeder';

// Sourced from scraper/by-name-xiaoge-hotpot_gege-kitchen_little-sheep-hotpot-feedbacks.json
// (search terms: 'xiaoge hotpot', 'gege kitchen', 'little sheep hotpot').
// That scraper only captures the resolved long Google Maps URL, never a
// maps.app.goo.gl short link, so every location here sets
// google_map_long_url directly and leaves google_map_url null.
const brands: ShopBrand[] = [
  {
    slug: 'xiao-ge-hotpot',
    logoFile: 'xiao-ge-logo.png',
    locations: [
      {
        name: 'Xiao Ge Hot Pot',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Xiao+Ge+Hot+Pot/@11.5461558,104.9079818,17z/data=!3m1!4b1!4m6!3m5!1s0x3109514e3cf1168b:0x37e35dba9e2c8081!8m2!3d11.5461558!4d104.9079818!16s%2Fg%2F11v_8ysqx8?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'Xiao Ge Hot Pot - Toul Kork',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Xiao+Ge+Hot+Pot+-+Toul+Kork/@11.5784864,104.8951704,16z/data=!3m1!4b1!4m6!3m5!1s0x310951cca184422d:0x5d343d8907d20fe2!8m2!3d11.5784864!4d104.8951704!16s%2Fg%2F11xm7q1th6?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'Xiao Ge Hot Pot - Boeung Keng Kang',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Xiao+Ge+Hot+Pot+-+Boeung+Keng+Kang/data=!4m7!3m6!1s0x31095132225eb265:0x891a1c4760eb8732!8m2!3d11.548273!4d104.9246775!16s%2Fg%2F11wx4fjl0m!19sChIJZbJeIjJRCTERMofrYEccGok?authuser=0&hl=en&rclk=1&hl=en',
      },
    ],
  },
  {
    slug: 'gege-kitchen',
    logoFile: 'ge-ge-hotpot.png',
    locations: [
      {
        name: 'GēGē Kitchen Toul Tumpoung',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Toul+Tumpoung/@11.5381609,104.9154746,17z/data=!3m1!4b1!4m6!3m5!1s0x31095120a7d495a1:0x8a1c7795bd0a58e7!8m2!3d11.5381609!4d104.9154746!16s%2Fg%2F11vb0xvzjh?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'GēGē Kitchen Riverside',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Riverside/@11.5663763,104.9317352,17z/data=!3m1!4b1!4m6!3m5!1s0x3109510047b7b67d:0x4fd0d00c78176133!8m2!3d11.5663763!4d104.9317352!16s%2Fg%2F11w3ck9lnz?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'GēGē Kitchen Boeung Keng Kang',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Boeung+Keng+Kang/@11.5539453,104.9262663,17z/data=!3m1!4b1!4m6!3m5!1s0x3109510009cc218b:0x98d4a067f6cb5a9e!8m2!3d11.5539453!4d104.9262663!16s%2Fg%2F11xlsrzr_6?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'GēGē Kitchen Chroy Changvar',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Chroy+Changvar/data=!4m7!3m6!1s0x310953003e27741b:0x248edf97ddf53f!8m2!3d11.5918796!4d104.9295466!16s%2Fg%2F11vxh44ptq!19sChIJG3QnPgBTCTERP_Xdl9-OJAA?authuser=0&hl=en&rclk=1&hl=en',
      },
      {
        name: 'GēGē Kitchen Koh Pich',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Koh+Pich/@11.5508896,104.9420882,17z/data=!3m1!4b1!4m6!3m5!1s0x3109570050eece8b:0xa9d9dff1eb9cc469!8m2!3d11.5508896!4d104.9420882!16s%2Fg%2F11xm_b33t_?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'GēGē Kitchen Street 2004',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/G%C4%93G%C4%93+Kitchen+Street+2004/@11.5531207,104.8803494,17z/data=!3m1!4b1!4m6!3m5!1s0x3109518227077507:0xf6cb329c3a09b8b3!8m2!3d11.5531207!4d104.8803494!16s%2Fg%2F11txkdxv9v?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
    ],
  },
  {
    // Google Maps lists this chain locally as "Little Sheep Hot Pot
    // Cambodia". Earlier data here mislabeled it as Happy Lamb Hot Pot /
    // 快乐小羊 (a different, unrelated brand) — the user corrected this and
    // supplied the real Little Sheep Hot Pot / 小肥羊 logo.
    slug: 'little-sheep-hotpot',
    logoFile: 'little-sheep-hotpot-logo.jpg',
    locations: [
      {
        name: 'Little Sheep Hot Pot Samdach Pan',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Little+Sheep+Hot+Pot+Cambodia+Samdach+Pan/@11.5613247,104.924893,17z/data=!3m1!4b1!4m6!3m5!1s0x31095139988b26e9:0x9fabe35032795f1b!8m2!3d11.5613247!4d104.924893!16s%2Fg%2F11dym5pyg3?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'Little Sheep Hot Pot The Park Community Mall',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Little+Sheep+Hot+Pot+Cambodia+The+Park+Community+Mall/@11.5347568,104.9541497,17z/data=!3m1!4b1!4m6!3m5!1s0x3109573ea324fbd7:0x97d2cc936a948fc1!8m2!3d11.5347568!4d104.9541497!16s%2Fg%2F11h2d4jjp1?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        name: 'Little Sheep Hot Pot ÆON Mall Sen Sok',
        google_map_url: null,
        google_map_long_url:
          'https://www.google.com/maps/place/Little+Sheep+Hot+Pot+-+%C3%86ON+Mall+Sen+Sok+Branch/@11.6004654,104.8856164,17z/data=!3m1!4b1!4m6!3m5!1s0x31095333ee123c13:0xd52015bb9341d5eb!8m2!3d11.6004654!4d104.8856164!16s%2Fg%2F11h70g9wtw?authuser=0&hl=en&hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D',
      },
    ],
  },
];

seedShopBrands(brands, {
  assetsDirName: 'restaurants',
  categories: ['restaurant', 'hotpot'],
  label: 'Restaurant',
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
