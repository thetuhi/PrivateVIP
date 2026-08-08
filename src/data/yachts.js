// ─────────────────────────────────────────────────────────────────────────────
// YACHT & BOAT CHARTER FLEET
//
// Same editing rules as experiences.js: add a block, drop WebP into
// public/images/yachts/<slug>/, list the filenames.
//
// `minHours` is the shortest booking the operator will accept, and the one
// commercial term still worth stating up front: it changes which boats suit a
// two-hour sunset run. Charter figures are not held here; every boat is quoted
// per enquiry.
// ─────────────────────────────────────────────────────────────────────────────

export const yachts = [
  {
    slug: 'classic-wooden-ketch',
    coverImage: 'ketch-deck.webp',
    images: ['ketch-deck.webp', 'ketch-saloon.webp', 'ketch-bow.webp', 'ketch-sunset.webp'],
    name: {
      en: 'Classic Wooden Ketch',
      ru: 'Классический деревянный кеч',
      tr: 'Klasik Ahşap Keç',
    },
    tagline: {
      en: '1968 Bodrum-built gulet, restored teak, and the only boat on this list with sails that are actually used.',
      ru: 'Гулет 1968 года из Бодрума, восстановленный тик и единственная лодка в списке, чьи паруса действительно работают.',
      tr: '1968 Bodrum yapımı gulet, restore edilmiş tik ve bu listede yelkenleri gerçekten kullanılan tek tekne.',
    },
    lengthM: 22,
    guests: 12,
    cabins: 4,
    crew: 3,
    minHours: 4,
    bestFor: {
      en: 'Long lazy afternoons, families, anyone who would rather sail than be driven',
      ru: 'Долгие неспешные дни, семьи, те, кто предпочитает идти под парусом',
      tr: 'Uzun ve tembel öğleden sonraları, aileler, sürüklenmek yerine yelken açmayı sevenler',
    },
    features: [
      { en: 'Full teak deck with shaded aft lounge', ru: 'Тиковая палуба с тенистым кормовым лаунджем', tr: 'Gölgeli kıç oturma alanıyla tam tik güverte' },
      { en: 'Four double cabins, air-conditioned', ru: 'Четыре двухместные каюты с кондиционером', tr: 'Klimalı dört çift kişilik kabin' },
      { en: 'Chef on board, menu agreed in advance', ru: 'Шеф-повар на борту, меню согласуется заранее', tr: 'Teknede şef, menü önceden kararlaştırılır' },
      { en: 'Swim platform and paddleboards', ru: 'Купальная платформа и сапборды', tr: 'Yüzme platformu ve kürek sörfü' },
    ],
  },
  {
    slug: 'motor-yacht-24',
    coverImage: 'motoryacht-profile.webp',
    images: ['motoryacht-profile.webp', 'motoryacht-flybridge.webp', 'motoryacht-salon.webp'],
    name: {
      en: 'Motor Yacht 24',
      ru: 'Моторная яхта 24',
      tr: 'Motor Yat 24',
    },
    tagline: {
      en: 'Flybridge, quiet engines and enough speed to reach the Black Sea mouth and be back for dinner.',
      ru: 'Флайбридж, тихие двигатели и скорость, чтобы дойти до устья Чёрного моря и вернуться к ужину.',
      tr: 'Flybridge, sessiz motorlar ve Karadeniz ağzına gidip akşam yemeğine dönmeye yetecek hız.',
    },
    lengthM: 24,
    guests: 12,
    cabins: 3,
    crew: 3,
    minHours: 3,
    bestFor: {
      en: 'Sunset charters, corporate entertaining, covering distance comfortably',
      ru: 'Закатные чартеры, корпоративные приёмы, комфортные длинные переходы',
      tr: 'Gün batımı kiralamaları, kurumsal ağırlama, mesafeyi rahat kat etmek',
    },
    features: [
      { en: 'Flybridge with 360° views and full bar', ru: 'Флайбридж с круговым обзором и полным баром', tr: '360° manzaralı ve tam barlı flybridge' },
      { en: 'Climate-controlled interior salon', ru: 'Салон с климат-контролем', tr: 'İklimlendirmeli iç salon' },
      { en: 'Tender and water toys', ru: 'Тендер и водное снаряжение', tr: 'Tender ve su oyuncakları' },
      { en: 'Discreet crew of three', ru: 'Ненавязчивый экипаж из трёх человек', tr: 'Üç kişilik sade ve dikkat çekmeyen mürettebat' },
    ],
  },
  {
    slug: 'bosphorus-classic-launch',
    coverImage: 'launch-varnish.webp',
    images: ['launch-varnish.webp', 'launch-cockpit.webp', 'launch-night.webp'],
    name: {
      en: 'Bosphorus Classic Launch',
      ru: 'Классический босфорский катер',
      tr: 'Klasik Boğaz Motoru',
    },
    tagline: {
      en: 'A varnished mahogany launch for two to six. The most photographed thing on the strait, and rightly.',
      ru: 'Лакированный катер из красного дерева на двоих–шестерых. Самое фотографируемое судно на проливе, заслуженно.',
      tr: 'İki ila altı kişilik cilalı maun motor. Boğazda en çok fotoğraflanan şey, ve haklı olarak.',
    },
    lengthM: 11,
    guests: 6,
    cabins: 0,
    crew: 2,
    minHours: 2,
    bestFor: {
      en: 'Proposals, anniversaries, two people who want the strait to themselves',
      ru: 'Предложения руки, годовщины, двое, которым нужен весь пролив',
      tr: 'Evlilik teklifleri, yıldönümleri, Boğazı kendine isteyen iki kişi',
    },
    features: [
      { en: 'Open cockpit with cushioned bench seating', ru: 'Открытый кокпит с мягкими диванами', tr: 'Minderli oturma gruplu açık kokpit' },
      { en: 'Champagne service and canapés', ru: 'Подача шампанского и канапе', tr: 'Şampanya servisi ve kanepeler' },
      { en: 'Can moor at the small private jetties larger boats cannot', ru: 'Швартуется у частных причалов, недоступных крупным судам', tr: 'Büyük teknelerin yanaşamadığı küçük özel iskelelere yanaşabilir' },
      { en: 'Blankets and heaters for winter evenings', ru: 'Пледы и обогреватели для зимних вечеров', tr: 'Kış akşamları için battaniye ve ısıtıcılar' },
    ],
  },
  {
    slug: 'sailing-catamaran',
    coverImage: 'catamaran-anchor.webp',
    images: ['catamaran-anchor.webp', 'catamaran-net.webp', 'catamaran-galley.webp'],
    name: {
      en: 'Sailing Catamaran',
      ru: 'Парусный катамаран',
      tr: 'Yelkenli Katamaran',
    },
    tagline: {
      en: 'Stable, shallow-draught and built for swimming. The right boat for a day at the islands.',
      ru: 'Устойчивый, малой осадки, создан для купания. Правильная лодка для дня на островах.',
      tr: 'Stabil, sığ su çekimli ve yüzmek için yapılmış. Adalarda bir gün için doğru tekne.',
    },
    lengthM: 14,
    guests: 10,
    cabins: 4,
    crew: 2,
    minHours: 6,
    bestFor: {
      en: 'Families with children, swimming days, guests who dislike heel',
      ru: 'Семьи с детьми, дни для купания, гости, не любящие крен',
      tr: 'Çocuklu aileler, yüzme günleri, yatmayı sevmeyen misafirler',
    },
    features: [
      { en: 'Trampoline nets forward, the best seat on any boat', ru: 'Носовые сетки-тримпалины, лучшее место на любой лодке', tr: 'Baştaki trampolin ağları, herhangi bir teknedeki en iyi yer' },
      { en: 'Two hulls, almost no roll at anchor', ru: 'Два корпуса, почти никакой качки на якоре', tr: 'İki gövde, demirdeyken neredeyse hiç yalpa yok' },
      { en: 'Snorkelling kit and a proper swim ladder', ru: 'Снаряжение для снорклинга и удобный трап', tr: 'Şnorkel takımı ve düzgün bir yüzme merdiveni' },
      { en: 'Shaded cockpit table seating ten', ru: 'Затенённый стол в кокпите на десять человек', tr: 'On kişilik gölgeli kokpit masası' },
    ],
  },
]

export const charterOccasions = [
  {
    id: 'sunset',
    title: { en: 'Sunset charter', ru: 'Закатный чартер', tr: 'Gün batımı kiralaması' },
    duration: { en: '3 hours', ru: '3 часа', tr: '3 saat' },
    body: {
      en: 'Board two hours before sunset, run the European shore north, turn at the second bridge and come back with the mosques lighting up.',
      ru: 'Посадка за два часа до заката, ход на север вдоль европейского берега, разворот у второго моста и возвращение, когда загораются мечети.',
      tr: 'Gün batımından iki saat önce binin, Avrupa yakasını kuzeye çıkın, ikinci köprüde dönün ve camiler yanarken geri gelin.',
    },
  },
  {
    id: 'full-day',
    title: { en: 'Full-day islands', ru: 'Полный день на островах', tr: 'Tam gün adalar' },
    duration: { en: '8 hours', ru: '8 часов', tr: '8 saat' },
    body: {
      en: 'Out to the Princes’ Islands with swim stops in the bays on the far side, lunch on board, back before the evening traffic on the water.',
      ru: 'К Принцевым островам с остановками для купания в бухтах с дальней стороны, обед на борту, возвращение до вечернего трафика на воде.',
      tr: 'Adalara çıkış, arka koylarda yüzme molaları, teknede öğle yemeği ve sudaki akşam yoğunluğundan önce dönüş.',
    },
  },
  {
    id: 'celebration',
    title: { en: 'Private celebration', ru: 'Частное торжество', tr: 'Özel kutlama' },
    duration: { en: '4–6 hours', ru: '4–6 часов', tr: '4–6 saat' },
    body: {
      en: 'Birthdays, proposals, anniversaries. Florist, photographer, musician and cake are all arranged through us and appear without you managing anything.',
      ru: 'Дни рождения, предложения, годовщины. Флорист, фотограф, музыкант и торт организуются через нас и появляются без вашего участия.',
      tr: 'Doğum günleri, evlilik teklifleri, yıldönümleri. Çiçekçi, fotoğrafçı, müzisyen ve pasta bizim üzerimizden ayarlanır ve siz hiçbir şey yönetmeden ortaya çıkar.',
    },
  },
  {
    id: 'corporate',
    title: { en: 'Corporate charter', ru: 'Корпоративный чартер', tr: 'Kurumsal kiralama' },
    duration: { en: 'Flexible', ru: 'Гибко', tr: 'Esnek' },
    body: {
      en: 'Client entertaining or a team offsite with catering, a PA system if you need to speak, and an invoice that satisfies a finance department.',
      ru: 'Приём клиентов или выездная встреча команды: кейтеринг, звукоусиление, если нужно выступать, и счёт, который устроит финансовый отдел.',
      tr: 'Müşteri ağırlama ya da ekip toplantısı: catering, konuşmanız gerekirse ses sistemi ve mali işlerin kabul edeceği bir fatura.',
    },
  },
]

export function getYacht(slug) {
  return yachts.find((y) => y.slug === slug)
}

export default yachts
