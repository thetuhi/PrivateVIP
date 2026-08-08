// ─────────────────────────────────────────────────────────────────────────────
// VIP FLEET & TRANSFERS
//
// Vehicles and the promises made about them. No figures: transfers are quoted
// per route on enquiry, so there is no rate table to keep in step with reality.
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
