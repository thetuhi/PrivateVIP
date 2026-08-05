// ─────────────────────────────────────────────────────────────────────────────
// VIP FLEET & TRANSFERS
//
// `transferRates` are fixed prices, not meters, that is the selling point, so
// the table shows them plainly rather than hiding them behind an enquiry.
// Update the numbers here and the Fleet page table updates.
// ─────────────────────────────────────────────────────────────────────────────

export const vehicles = [
  {
    slug: 'mercedes-s-class',
    coverImage: 's-class.webp',
    images: ['s-class.webp', 's-class-interior.webp'],
    name: 'Mercedes-Benz S-Class',
    passengers: 3,
    luggage: 2,
    tier: { en: 'Executive saloon', ru: 'Представительский седан', tr: 'Yönetici sedan' },
    body: {
      en: 'For one or two travellers who want the quietest car on the road. Rear climate, reclining seats, and a driver who does not make conversation unless you start one.',
      ru: 'Для одного-двух пассажиров, которым нужен самый тихий автомобиль на дороге. Климат сзади, раскладывающиеся кресла и водитель, который не заговорит первым.',
      tr: 'Yoldaki en sessiz aracı isteyen bir ya da iki yolcu için. Arka klima, yatan koltuklar ve siz başlatmadıkça sohbet etmeyen bir şoför.',
    },
  },
  {
    slug: 'mercedes-v-class',
    coverImage: 'v-class.webp',
    images: ['v-class.webp', 'v-class-interior.webp'],
    name: 'Mercedes-Benz V-Class / Vito VIP',
    passengers: 6,
    luggage: 6,
    tier: { en: 'VIP van', ru: 'VIP-минивэн', tr: 'VIP van' },
    body: {
      en: 'The workhorse of every good Istanbul operation. Captain seats facing each other, a table between them, and enough luggage space that nobody holds a bag on their lap.',
      ru: 'Рабочая лошадка любой хорошей стамбульской программы. Кресла лицом друг к другу, стол между ними и достаточно места для багажа, чтобы никто не держал сумку на коленях.',
      tr: 'İyi işleyen her İstanbul operasyonunun beygiri. Karşılıklı kaptan koltukları, aralarında masa ve kimsenin kucağında çanta tutmayacağı kadar bagaj alanı.',
    },
  },
  {
    slug: 'mercedes-sprinter',
    coverImage: 'sprinter.webp',
    images: ['sprinter.webp', 'sprinter-interior.webp'],
    name: 'Mercedes-Benz Sprinter VIP',
    passengers: 12,
    luggage: 12,
    tier: { en: 'Group coach', ru: 'Групповой микроавтобус', tr: 'Grup aracı' },
    body: {
      en: 'Twelve seats without the compromise, leather, individual climate, and standing headroom that matters on a two-hour transfer.',
      ru: 'Двенадцать мест без компромиссов: кожа, индивидуальный климат и высота салона, которая имеет значение на двухчасовом трансфере.',
      tr: 'Ödün vermeden on iki koltuk, deri, kişisel iklimlendirme ve iki saatlik bir transferde önemli olan ayakta durabilme yüksekliği.',
    },
  },
  {
    slug: 'armoured-detail',
    coverImage: 'armoured.webp',
    images: ['armoured.webp'],
    name: { en: 'Armoured vehicle & close protection', ru: 'Бронированный автомобиль и охрана', tr: 'Zırhlı araç ve yakın koruma' },
    passengers: 4,
    luggage: 3,
    tier: { en: 'Security detail', ru: 'Служба безопасности', tr: 'Güvenlik ekibi' },
    body: {
      en: 'B6-rated vehicle with licensed close-protection officers, arranged on request with reasonable notice. Route planning and advance work included.',
      ru: 'Автомобиль класса B6 с лицензированными офицерами личной охраны, по запросу, при разумном сроке уведомления. Планирование маршрута и подготовка включены.',
      tr: 'Lisanslı yakın koruma görevlileriyle B6 sınıfı araç, makul bir ön bildirimle talep üzerine ayarlanır. Rota planlaması ve ön çalışma dâhildir.',
    },
  },
]

// Fixed, all-in prices. No meter, no surge, no "airport supplement".
export const transferRates = [
  {
    id: 'ist-europe',
    from: { en: 'Istanbul Airport (IST)', ru: 'Аэропорт Стамбул (IST)', tr: 'İstanbul Havalimanı (IST)' },
    to: { en: 'European side hotels', ru: 'Отели европейской стороны', tr: 'Avrupa yakası otelleri' },
    duration: { en: '45–70 min', ru: '45–70 мин', tr: '45–70 dk' },
    saloon: 90,
    van: 110,
    sprinter: 160,
  },
  {
    id: 'ist-asia',
    from: { en: 'Istanbul Airport (IST)', ru: 'Аэропорт Стамбул (IST)', tr: 'İstanbul Havalimanı (IST)' },
    to: { en: 'Asian side hotels', ru: 'Отели азиатской стороны', tr: 'Anadolu yakası otelleri' },
    duration: { en: '60–95 min', ru: '60–95 мин', tr: '60–95 dk' },
    saloon: 110,
    van: 135,
    sprinter: 185,
  },
  {
    id: 'saw-europe',
    from: { en: 'Sabiha Gökçen (SAW)', ru: 'Сабиха Гёкчен (SAW)', tr: 'Sabiha Gökçen (SAW)' },
    to: { en: 'European side hotels', ru: 'Отели европейской стороны', tr: 'Avrupa yakası otelleri' },
    duration: { en: '60–100 min', ru: '60–100 мин', tr: '60–100 dk' },
    saloon: 105,
    van: 130,
    sprinter: 180,
  },
  {
    id: 'saw-asia',
    from: { en: 'Sabiha Gökçen (SAW)', ru: 'Сабиха Гёкчен (SAW)', tr: 'Sabiha Gökçen (SAW)' },
    to: { en: 'Asian side hotels', ru: 'Отели азиатской стороны', tr: 'Anadolu yakası otelleri' },
    duration: { en: '30–55 min', ru: '30–55 мин', tr: '30–55 dk' },
    saloon: 75,
    van: 95,
    sprinter: 140,
  },
  {
    id: 'hourly',
    from: { en: 'At your disposal', ru: 'В ваше распоряжение', tr: 'Emrinizde' },
    to: { en: 'Anywhere in the city, hourly', ru: 'Куда угодно в городе, почасово', tr: 'Şehirde her yere, saatlik' },
    duration: { en: 'min. 4h', ru: 'от 4 ч', tr: 'en az 4 sa' },
    saloon: 45,
    van: 55,
    sprinter: 75,
  },
]

export const transferPromises = [
  {
    id: 'flight-tracked',
    title: { en: 'Your flight is tracked', ru: 'Ваш рейс отслеживается', tr: 'Uçuşunuz takip edilir' },
    body: {
      en: 'If you land three hours late, the driver is there three hours late. No extra charge, no missed pickup.',
      ru: 'Если вы прилетите на три часа позже, водитель будет там на три часа позже. Без доплат и без пропущенной встречи.',
      tr: 'Üç saat geç inerseniz, şoför üç saat geç orada olur. Ek ücret yok, kaçırılan karşılama yok.',
    },
  },
  {
    id: 'meet-greet',
    title: { en: 'Met inside, not outside', ru: 'Встреча внутри, а не снаружи', tr: 'Dışarıda değil, içeride karşılama' },
    body: {
      en: 'Your driver waits at the arrivals gate with your name, takes the luggage, and walks you to the car. You do not go looking in a car park.',
      ru: 'Водитель ждёт у выхода из зоны прилёта с табличкой, забирает багаж и провожает к автомобилю. Вам не нужно искать его на парковке.',
      tr: 'Şoförünüz geliş kapısında adınızla bekler, bagajı alır ve sizi araca kadar götürür. Otoparkta kimseyi aramazsınız.',
    },
  },
  {
    id: 'fixed-price',
    title: { en: 'The price is the price', ru: 'Цена окончательная', tr: 'Fiyat neyse odur' },
    body: {
      en: 'Quoted all-in: tolls, parking, waiting time and VAT. Traffic is our problem, not a line on your invoice.',
      ru: 'Цена включает всё: проезд, парковку, время ожидания и НДС. Пробки, наша проблема, а не строка в вашем счёте.',
      tr: 'Her şey dâhil: geçiş ücretleri, otopark, bekleme süresi ve KDV. Trafik bizim sorunumuz, faturanızda bir satır değil.',
    },
  },
  {
    id: 'child-seats',
    title: { en: 'Child seats, free', ru: 'Детские кресла бесплатно', tr: 'Çocuk koltuğu ücretsiz' },
    body: {
      en: 'Infant carriers, toddler seats and boosters, fitted before you arrive. Tell us ages at booking.',
      ru: 'Автолюльки, детские кресла и бустеры, установлены до вашего приезда. Укажите возраст при бронировании.',
      tr: 'Bebek taşıyıcıları, çocuk koltukları ve yükselticiler siz gelmeden takılır. Rezervasyonda yaşları bildirin.',
    },
  },
]

export default vehicles
