/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// --- Embedding helpers ---
function cheapEmbedFromText(text: string, dim = 128): number[] {
  const hash = crypto.createHash('sha256').update(text).digest();
  const bytes = Array.from(hash);
  const arr: number[] = [];
  while (arr.length < dim) arr.push(...bytes);
  return arr.slice(0, dim).map((n) => (n / 127.5) - 1);
}

async function embedAllBusinesses() {
  const all = await prisma.business.findMany();
  for (const b of all) {
    const basis = [b.name, b.description, b.location].filter(Boolean).join(' | ');
    const vec = cheapEmbedFromText(basis);
    await prisma.business.update({
      where: { id: b.id },
      data: { embedding: vec as any },
    });
  }
  console.log(`🧠 Embedded ${all.length} businesses`);
}

async function main() {
  console.log('🌱 Starting full reset & seeding...');

  // Админ/юзер үүсгэх (жишээ)
  const adminPassHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: Role.admin, name: 'Admin', passwordHash: adminPassHash },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.admin,
      image: null,
      passwordHash: adminPassHash,
    },
  });
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      role: Role.user,
      image: null,
    },
  });

  // 0. Хуучин өгөгдөл устгах
  await prisma.business.deleteMany();
  await prisma.category.deleteMany();
  console.log('🧹 Old data cleared');

  // 1. Category-ууд
  const categories = [
    { id: '1', name: 'Ресторан' },
    { id: '2', name: 'Номын сан' },
    { id: '3', name: 'Банк' },
    { id: '4', name: 'Дэлгүүр' },
    { id: '5', name: 'Эмнэлэг' },
  ];
  for (const c of categories) await prisma.category.create({ data: c });
  console.log('📁 Categories inserted');

  // 2. Category-уудыг авах
  const restaurant = await prisma.category.findUnique({ where: { id: '1' } });
  const lib = await prisma.category.findUnique({ where: { id: '2' } });
  const bank = await prisma.category.findUnique({ where: { id: '3' } });
  const shopping = await prisma.category.findUnique({ where: { id: '4' } });
  const hospital = await prisma.category.findUnique({ where: { id: '5' } });

  // 3. Dummy бизнесүүд
  const restaurants = [
    {
      name: 'Modern nomads',
      description: 'Монгол үндэсний хоолны сүлжээ ресторан',
      address: 'УБ, СБД, 1-р хороо',
      phone: '99112233',
      email: 'info@modernnomads.mn',
      website: 'https://modernnomads.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/modernnomads',
      instagramUrl: 'https://instagram.com/modernnomads',
      timetable: '10:00–22:00',
      rating: 5,
      topRating: true,
      latitude: 47.9185,
      longitude: 106.9178,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/Screenshot+2025-11-27+at+01.29.27.png',
    },
    {
      name: 'BD’s Mongolian BBQ',
      description: 'Mongolian grill стильтэй ресторан',
      address: 'УБ, ХУД, Чингисийн өргөн чөлөө',
      phone: '99001122',
      email: 'info@bdsmongolia.mn',
      website: 'https://bdsmongolia.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/bdsmongolia',
      instagramUrl: 'https://instagram.com/bdsmongolia',
      timetable: '11:00–23:00',
      rating: 3,
      topRating: true,
      latitude: 47.9206,
      longitude: 106.9189,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/bbq.png',
    },
    {
      name: 'Khaan Deli',
      description: 'Барууны болон Монгол хоолны ресторан',
      address: 'УБ, БГД, 4-р хороо, Энхтайваны өргөн чөлөө',
      phone: '99115566',
      email: 'contact@khaandeli.mn',
      website: 'https://khaandeli.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/khaandeli',
      instagramUrl: 'https://instagram.com/khaandeli',
      timetable: '09:00–22:00',
      rating: 3,
      topRating: true,
      latitude: 47.9230,
      longitude: 106.9075,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/Khaan+Deli.png',
    },
    {
      name: 'Terelj Lodge',
      description: 'Жуулчны бааз, Монгол хоол, амралт зугаа',
      address: 'Тэрэлж, Газарчны хөндий',
      phone: '99554433',
      email: 'info@tereljlodge.mn',
      website: 'https://tereljlodge.mn',
      location: 'Тэрэлж',
      facebookUrl: 'https://facebook.com/tereljlodge',
      instagramUrl: 'https://instagram.com/tereljlodge',
      timetable: '09:00–21:00',
      rating: 4,
      topRating: true,
      latitude: 47.8140,
      longitude: 107.3386,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/tereljLodge.png',
    },
    {
      name: 'Veranda Restaurant',
      description: 'Европ хоолны ресторан, үзэгдэх орчин сайтай',
      address: 'УБ, СБД, 1-р хороо, Central Tower',
      phone: '77337733',
      email: 'info@veranda.mn',
      website: 'https://veranda.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/verandamn',
      instagramUrl: 'https://instagram.com/verandamn',
      timetable: '10:00–23:00',
      rating: 5,
      topRating: true,
      latitude: 47.9112,
      longitude: 106.9164,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/verandaRestaurant.png',
    },
    {
      name: 'Korean House',
      description: 'Солонгос үндэсний хоолны газар',
      address: 'УБ, ХУД, 15-р хороо, Seoul Street',
      phone: '99229922',
      email: 'khouse@seoul.mn',
      website: 'https://koreanhouse.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/koreanhousemn',
      instagramUrl: 'https://instagram.com/koreanhousemn',
      timetable: '11:00–22:00',
      rating: 2,
      topRating: true,
      latitude: 47.9260,
      longitude: 106.9260,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/KoreaHouse.png',
    },
    {
      name: 'Sakura Sushi',
      description: 'Япон хоолны сүлжээ ресторан',
      address: 'УБ, СБД, 6-р хороо, Peace Avenue',
      phone: '99334455',
      email: 'sakura@sushi.mn',
      website: 'https://sushisakura.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/sushisakura',
      instagramUrl: 'https://instagram.com/sushisakura',
      timetable: '10:00–22:00',
      rating: 5,
      topRating: false,
      latitude: 47.9159,
      longitude: 106.9186,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/sakura.png',
    },
    {
      name: 'The Bull Hotpot',
      description: 'Хятад халуун тогооны ресторан',
      address: 'УБ, БЗД, Нарны зам',
      phone: '99776655',
      email: 'bull@hotpot.mn',
      website: 'https://bullhotpot.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/bullhotpot',
      instagramUrl: 'https://instagram.com/bullhotpot',
      timetable: '11:00–23:30',
      rating: 5,
      topRating: false,
      latitude: 47.8650,
      longitude: 106.8800,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/BullHotpot.png',
    },
    {
      name: 'PizzaHut Mongolia',
      description: 'Пицца, паста, шарсан хоолны газар',
      address: 'УБ, БГД, Max Mall дотор',
      phone: '77007700',
      email: 'info@pizzahut.mn',
      website: 'https://pizzahut.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/pizzahutmn',
      instagramUrl: 'https://instagram.com/pizzahutmn',
      timetable: '10:00–22:00',
      rating: 5,
      topRating: false,
      latitude: 47.92097573321183,
      longitude: 106.91909437648627,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/pizzaHut.png',
    },
    {
      name: 'Silk Road Tea House',
      description: 'Цайны газар, соёлын уур амьсгалтай кафе',
      address: 'УБ, СБД, 7-р хороо, State Department Store орчим',
      phone: '88118811',
      email: 'silkroad@tea.mn',
      website: 'https://silkroadtea.mn',
      location: 'Улаанбаатар',
      facebookUrl: 'https://facebook.com/silkroadtea',
      instagramUrl: 'https://instagram.com/silkroadtea',
      timetable: '09:00–22:00',
      rating: 5,
      topRating: false,
      latitude: 47.9148,
      longitude: 106.9183,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/silkRodeSpices.png',
    },
  ];
  const libraries = [
    {
      name: 'Улсын Номын Сан',
      description: 'Үндэсний номын сан',
      address: 'Улаанбаатар, Чингэлтэй',
      phone: '77112233',
      email: 'info@national-library.mn',
      website: 'https://library.example',
      location: 'Улаанбаатар',
      timetable: '09:00–18:00',
      rating: 5,
      topRating: true,
      latitude: 47.9116,
      longitude: 106.9055,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/undesniiNomiinSan.jpg',
    },
  ];
  const banks = [
    {
      name: 'Хаан Банк',
      description: 'үргэлж танд',
      address: 'Улаанбаатар, Чингэлтэй',
      phone: '77112233',
      email: 'info@national-library.mn',
      website: 'https://library.example',
      location: 'Улаанбаатар',
      timetable: '09:00–18:00',
      rating: 5,
      topRating: true,
      latitude: 47.9211,
      longitude: 106.9186,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/khanbank.jpg',
    },
  ];
  const shoppings = [
    {
      name: 'Улсын Их Дэлгүүр',
      description: 'Үндэсний их дэлгүүр',
      address: 'Улаанбаатар, Чингэлтэй',
      phone: '77112233',
      email: 'info@national-library.mn',
      website: 'https://library.example',
      location: 'Улаанбаатар',
      timetable: '09:00–18:00',
      topRating: true,
      latitude: 47.91694470102964,
      longitude: 106.90611974425805,
      rating: 5,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/ulsiinIhDelguur.jpg',
    },
  ];
  const hospitals = [
    {
      name: 'Эх нялхас',
      description: 'Үндэсний эмнэлэг',
      address: 'Улаанбаатар, Чингэлтэй',
      phone: '77112233',
      email: 'info@national-library.mn',
      website: 'https://library.example',
      location: 'Улаанбаатар',
      timetable: '09:00–18:00',
      rating: 5,
      topRating: false,
      latitude: 47.9440,
      longitude: 106.9120,
      logoUrl: 'https://yellow-s3sodon.s3.us-east-1.amazonaws.com/ehnylhas.jpg',
    },
  ];

  // Coords helper
  function genCoords(index: number, baseLat = 47.918209, baseLng = 106.917199) {
    const step = 0.0025;
    const lat = baseLat + ((index % 7) - 3) * step + ((index % 3) * 0.0005);
    const lng = baseLng + (Math.floor(index / 7) - 3) * step + ((index % 5) * 0.0006);
    return { lat, lng };
  }

  // 4. Insert helper
  async function insertBusinesses(items: any[], categoryId: string, categoryName: string) {
    const data = items.map((item: any, idx: number) => {
      const coords = genCoords(idx);
      return {
        ...item,
        categoryId,
        latitude: item.latitude ?? coords.lat,
        longitude: item.longitude ?? coords.lng,
      };
    });
    await prisma.business.createMany({ data });
    console.log(`✅ Inserted ${items.length} ${categoryName} businesses (with coords)`);
  }

  // 5. Insert all
  await insertBusinesses(restaurants, restaurant!.id, 'Restaurant');
  await insertBusinesses(libraries, lib!.id, 'Library');
  await insertBusinesses(banks, bank!.id, 'Bank');
  await insertBusinesses(shoppings, shopping!.id, 'Shopping');
  await insertBusinesses(hospitals, hospital!.id, 'Hospital');

  // 6. Embeddings — ОРУУЛСНЫ ДАРАА тооцоолно
  await embedAllBusinesses();

  console.log('🌱 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });