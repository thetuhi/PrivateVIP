// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CATALOG, the whole tour offering lives here. No backend.
//
// To add an experience: copy a block, give it a unique `slug`, drop optimised
// WebP into public/images/experiences/<slug>/ and list the filenames in
// `images`. The catalog page, detail page, sitemap and search all read from
// this array automatically.
//
// Every visitor-facing string is an object keyed by language code. A missing
// language falls back to `en` (see localise() in src/utils/i18nHelpers.js).
//
// `priceFrom` is per party, not per person, that is the whole point of a
// private tour and the UI says so explicitly.
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'all', label: { en: 'All experiences', ru: 'Все программы', tr: 'Tüm deneyimler' } },
  { id: 'heritage', label: { en: 'Heritage', ru: 'Наследие', tr: 'Miras' } },
  { id: 'culinary', label: { en: 'Culinary', ru: 'Гастрономия', tr: 'Gastronomi' } },
  { id: 'bosphorus', label: { en: 'Bosphorus', ru: 'Босфор', tr: 'Boğaz' } },
  { id: 'shopping', label: { en: 'Sourcing', ru: 'Шопинг', tr: 'Alışveriş' } },
  { id: 'escape', label: { en: 'Day escapes', ru: 'Загород', tr: 'Kaçamaklar' } },
]

export const experiences = [
  {
    slug: 'imperial-istanbul',
    category: 'heritage',
    featured: true,
    durationHours: 8,
    maxGuests: 6,
    priceFrom: 890,
    currency: 'EUR',
    coverImage: 'hagia-sophia-interior.webp',
    images: [
      'hagia-sophia-interior.webp',
      'topkapi-courtyard.webp',
      'blue-mosque-dome.webp',
      'basilica-cistern.webp',
      'sultanahmet-dusk.webp',
    ],
    title: {
      en: 'Imperial Istanbul',
      ru: 'Императорский Стамбул',
      tr: 'İmparatorluk İstanbulu',
    },
    summary: {
      en: 'Fifteen centuries of empire in a single day, with the queues, the crowds and the guesswork removed.',
      ru: 'Пятнадцать веков империй за один день, без очередей, толп и импровизации.',
      tr: 'Bir günde on beş yüzyıllık imparatorluk, kuyruk, kalabalık ve tahmin olmadan.',
    },
    description: {
      en: 'Sultanahmet rewards people who arrive early and know exactly where to stand. Your guide, a licensed historian, not a script-reader, times the route around the light and the tour-bus schedules, so you see the Hagia Sophia mosaics before the first coach arrives and the Topkapı harem when it has emptied. Entrance tickets are pre-purchased, a private vehicle waits between sites, and lunch is at a table that was reserved, not queued for.',
      ru: 'Султанахмет вознаграждает тех, кто приходит рано и точно знает, где встать. Ваш гид, лицензированный историк, а не чтец сценария, строит маршрут вокруг света и расписания туристических автобусов: вы увидите мозаики Айя-Софии до прибытия первого автобуса, а гарем Топкапы, когда он опустеет. Билеты куплены заранее, между объектами ждёт частный автомобиль, а обед, за забронированным столом.',
      tr: 'Sultanahmet, erken gelen ve tam olarak nerede duracağını bilenleri ödüllendirir. Rehberiniz, ezber okuyan biri değil, lisanslı bir tarihçi, rotayı ışığa ve turist otobüslerinin saatlerine göre kurar: Ayasofya mozaiklerini ilk otobüs gelmeden, Topkapı haremini ise boşaldığında görürsünüz. Biletler önceden alınır, noktalar arasında özel araç bekler, öğle yemeği ise sırada beklenmiş değil, ayrılmış bir masadadır.',
    },
    highlights: [
      {
        en: 'Skip-the-line entry to Hagia Sophia, Topkapı Palace and the Basilica Cistern',
        ru: 'Вход без очереди в Айя-Софию, дворец Топкапы и Цистерну Базилику',
        tr: 'Ayasofya, Topkapı Sarayı ve Yerebatan Sarnıcı’na sırasız giriş',
      },
      {
        en: 'Licensed art historian guiding in English, Russian or Turkish',
        ru: 'Лицензированный историк искусства: английский, русский или турецкий',
        tr: 'İngilizce, Rusça veya Türkçe rehberlik eden lisanslı sanat tarihçisi',
      },
      {
        en: 'Harem apartments and the Imperial Treasury, both frequently skipped',
        ru: 'Покои гарема и Императорская сокровищница, их часто пропускают',
        tr: 'Sıkça atlanan Harem daireleri ve Hazine Dairesi',
      },
      {
        en: 'Private chauffeured vehicle between every site, air-conditioned and waiting',
        ru: 'Частный автомобиль с водителем между объектами, с кондиционером, всегда рядом',
        tr: 'Her nokta arasında klimalı, bekleyen özel şoförlü araç',
      },
    ],
    itinerary: [
      {
        time: '08:30',
        title: { en: 'Hotel pickup', ru: 'Встреча у отеля', tr: 'Otelden alış' },
        body: {
          en: 'Your guide and driver meet you in the lobby. A short briefing over the day’s route, then straight to Sultanahmet ahead of the morning coaches.',
          ru: 'Гид и водитель встречают вас в лобби. Короткий обзор маршрута, и сразу в Султанахмет, до утренних автобусов.',
          tr: 'Rehberiniz ve şoförünüz sizi lobide karşılar. Günün rotası üzerine kısa bir bilgilendirme, ardından sabah otobüslerinden önce doğruca Sultanahmet’e.',
        },
      },
      {
        time: '09:00',
        title: { en: 'Hagia Sophia', ru: 'Айя-София', tr: 'Ayasofya' },
        body: {
          en: 'Ninety minutes inside the building that changed architecture twice. The upper gallery mosaics are the reason for the early start, the light lands on them for roughly an hour.',
          ru: 'Полтора часа внутри здания, дважды изменившего архитектуру. Мозаики верхней галереи, причина раннего старта: свет ложится на них примерно на час.',
          tr: 'Mimarlığı iki kez değiştiren yapının içinde doksan dakika. Erken başlamanın sebebi üst galeri mozaikleri, ışık üzerlerine yaklaşık bir saat düşer.',
        },
      },
      {
        time: '10:45',
        title: { en: 'The Blue Mosque & Hippodrome', ru: 'Голубая мечеть и Ипподром', tr: 'Sultanahmet Camii ve Hipodrom' },
        body: {
          en: 'İznik tilework at close range, then the Hippodrome’s obelisks, an Egyptian one older than the city itself. Prayer times are checked the morning of, and the route flexes around them.',
          ru: 'Изникские изразцы вблизи, затем обелиски Ипподрома, египетский старше самого города. Время намаза уточняется утром, маршрут подстраивается.',
          tr: 'Yakın mesafeden İznik çinileri, ardından Hipodrom’un dikilitaşları. Mısır dikilitaşı şehirden bile eski. Namaz vakitleri sabah kontrol edilir, rota buna göre esner.',
        },
      },
      {
        time: '12:15',
        title: { en: 'Lunch, reserved', ru: 'Обед по брони', tr: 'Ayrılmış masada öğle yemeği' },
        body: {
          en: 'A courtyard table at an Ottoman-era house restaurant off the tourist axis. Dietary requirements are passed ahead; the kitchen plans for them.',
          ru: 'Стол во внутреннем дворе ресторана в османском доме вдали от туристической оси. Пищевые ограничения передаются заранее, кухня их учитывает.',
          tr: 'Turist aksının dışında, Osmanlı dönemi bir konak restoranında avlu masası. Diyet ihtiyaçları önceden iletilir; mutfak buna göre hazırlanır.',
        },
      },
      {
        time: '13:45',
        title: { en: 'Topkapı Palace & Harem', ru: 'Дворец Топкапы и гарем', tr: 'Topkapı Sarayı ve Harem' },
        body: {
          en: 'Four courtyards, the Treasury, and the Harem apartments most itineraries drop for time. Two and a half hours, enough to sit in the Baghdad Kiosk and look at the Golden Horn without hurrying.',
          ru: 'Четыре двора, сокровищница и покои гарема, которые обычно вычёркивают ради экономии времени. Два с половиной часа, можно без спешки посидеть в Багдадском киоске и посмотреть на Золотой Рог.',
          tr: 'Dört avlu, Hazine ve çoğu programın zaman için çıkardığı Harem daireleri. İki buçuk saat. Bağdat Köşkü’nde oturup Haliç’e acele etmeden bakmaya yeter.',
        },
      },
      {
        time: '16:30',
        title: { en: 'Basilica Cistern', ru: 'Цистерна Базилика', tr: 'Yerebatan Sarnıcı' },
        body: {
          en: 'Cool, dark and quiet by late afternoon. The Medusa heads at the far end, and the reason a Roman city could survive a siege.',
          ru: 'К вечеру здесь прохладно, темно и тихо. Головы Медузы в дальнем конце, и объяснение, почему римский город мог пережить осаду.',
          tr: 'Öğleden sonra serin, karanlık ve sessiz. Dipteki Medusa başları ve bir Roma şehrinin kuşatmayı nasıl atlattığının cevabı.',
        },
      },
      {
        time: '17:30',
        title: { en: 'Return', ru: 'Возвращение', tr: 'Dönüş' },
        body: {
          en: 'Back to your hotel, or dropped anywhere you would rather be. Karaköy for dinner, the Bosphorus for sunset. The car is yours until then.',
          ru: 'Обратно в отель, или туда, где вам приятнее: Каракёй на ужин, Босфор на закат. Автомобиль в вашем распоряжении.',
          tr: 'Otelinize dönüş ya da tercih ettiğiniz herhangi bir yere bırakış, akşam yemeği için Karaköy, gün batımı için Boğaz. Araç o ana kadar sizindir.',
        },
      },
    ],
    includes: [
      { en: 'Private licensed guide for the full day', ru: 'Частный лицензированный гид на весь день', tr: 'Tam gün özel lisanslı rehber' },
      { en: 'All museum and site entrance tickets', ru: 'Все входные билеты в музеи и на объекты', tr: 'Tüm müze ve ören yeri giriş biletleri' },
      { en: 'Chauffeured vehicle, fuel, parking and tolls', ru: 'Автомобиль с водителем, топливо, парковка и проезд', tr: 'Şoförlü araç, yakıt, otopark ve geçiş ücretleri' },
      { en: 'Reserved lunch, three courses', ru: 'Обед по брони, три блюда', tr: 'Rezerve öğle yemeği, üç kap' },
      { en: 'Hotel pickup and drop-off within the city', ru: 'Трансфер от отеля и обратно в черте города', tr: 'Şehir içi otelden alış ve bırakış' },
    ],
    excludes: [
      { en: 'Gratuities, entirely at your discretion', ru: 'Чаевые, полностью на ваше усмотрение', tr: 'Bahşişler, tamamen sizin takdirinizde' },
      { en: 'Personal purchases', ru: 'Личные покупки', tr: 'Kişisel alışverişler' },
    ],
    good_to_know: {
      en: 'Hagia Sophia and the Blue Mosque are active mosques. Shoulders and knees covered for everyone; a headscarf for women, which we carry spares of. Topkapı closes on Tuesdays, so we run this itinerary in reverse that day.',
      ru: 'Айя-София и Голубая мечеть, действующие мечети. Плечи и колени должны быть закрыты; женщинам нужен платок, у нас есть запасные. Топкапы закрыт по вторникам: в этот день маршрут идёт в обратном порядке.',
      tr: 'Ayasofya ve Sultanahmet Camii ibadete açıktır. Herkes için omuz ve dizler kapalı; kadınlar için başörtüsü gerekir, yedeklerini biz taşırız. Topkapı salı günleri kapalıdır; o gün programı ters yönde işletiriz.',
    },
  },

  {
    slug: 'the-ottoman-table',
    category: 'culinary',
    featured: true,
    durationHours: 6,
    maxGuests: 8,
    priceFrom: 620,
    currency: 'EUR',
    coverImage: 'meze-table.webp',
    images: ['meze-table.webp', 'kadikoy-market.webp', 'spice-merchant.webp', 'meyhane-evening.webp'],
    title: {
      en: 'The Ottoman Table',
      ru: 'Османский стол',
      tr: 'Osmanlı Sofrası',
    },
    summary: {
      en: 'Two continents, seven tastings and one long meze table, led by a chef who buys here.',
      ru: 'Два континента, семь дегустаций и один длинный стол мезе, с шеф-поваром, который здесь закупается.',
      tr: 'İki kıta, yedi tadım ve uzun bir meze sofrası, burada alışveriş yapan bir şefle.',
    },
    description: {
      en: 'This is not a food tour with a clipboard. You walk the Kadıköy market with someone the fishmongers know by name, cross to Karaköy on the ferry with tea in hand, and finish at a meyhane table where the meze arrive because the owner chose them for you. Along the way: a 150-year-old lokanta, a third-generation pastırma cutter, and the coffee roaster that supplies half of Moda.',
      ru: 'Это не гастротур с планшетом в руках. Вы идёте по рынку Кадыкёй с человеком, которого торговцы рыбой знают по имени, переправляетесь в Каракёй на пароме с чаем в руке и завершаете вечер за столом в мейхане, где мезе приносят потому, что их выбрал для вас хозяин. По пути: локанта возрастом 150 лет, мастер пастырмы в третьем поколении и обжарщик кофе, снабжающий половину Моды.',
      tr: 'Bu, elinde pano olan bir yemek turu değil. Kadıköy pazarını, balıkçıların adıyla tanıdığı biriyle gezersiniz; elinizde çayla vapurla Karaköy’e geçersiniz; ve mezelerin size sahibi seçtiği için geldiği bir meyhane sofrasında bitirirsiniz. Yol boyunca: 150 yıllık bir lokanta, üçüncü kuşak bir pastırmacı ve Moda’nın yarısına kahve veren kavurmacı.',
    },
    highlights: [
      { en: 'Kadıköy produce market before the lunch rush', ru: 'Рынок Кадыкёй до обеденного наплыва', tr: 'Öğle yoğunluğundan önce Kadıköy pazarı' },
      { en: 'Seven seated tastings, not seven paper cups', ru: 'Семь дегустаций за столом, а не семь бумажных стаканчиков', tr: 'Yedi ayakta değil, oturarak tadım' },
      { en: 'Bosphorus ferry crossing between the Asian and European sides', ru: 'Переправа через Босфор с азиатской стороны на европейскую', tr: 'Anadolu ve Avrupa yakaları arasında vapur geçişi' },
      { en: 'Meyhane finale with rakı, or the wine list if you prefer', ru: 'Финал в мейхане с ракы, или винная карта, если предпочитаете', tr: 'Rakı ile meyhane finali; dilerseniz şarap listesi' },
    ],
    itinerary: [
      {
        time: '14:00',
        title: { en: 'Meet in Moda', ru: 'Встреча в Моде', tr: 'Moda’da buluşma' },
        body: {
          en: 'We start on the Asian side, where the city eats when it is not performing. Coffee first, standing up, the way it is done.',
          ru: 'Начинаем на азиатской стороне, там, где город ест, когда не играет на публику. Сначала кофе, стоя, как здесь принято.',
          tr: 'Şehrin gösteri yapmadığı zaman yemek yediği Anadolu yakasında başlıyoruz. Önce kahve, ayakta, olması gerektiği gibi.',
        },
      },
      {
        time: '14:45',
        title: { en: 'The market', ru: 'Рынок', tr: 'Pazar' },
        body: {
          en: 'Pastırma cut to order, aged kaşar, olives graded by hand, and a pickle shop that has been arguing about brine since 1963.',
          ru: 'Пастырма, нарезанная при вас, выдержанный кашар, оливки, отобранные вручную, и лавка солений, где спорят о рассоле с 1963 года.',
          tr: 'Siparişe göre kesilen pastırma, yıllanmış kaşar, elde ayrılmış zeytin ve 1963’ten beri salamura tartışan bir turşucu.',
        },
      },
      {
        time: '16:15',
        title: { en: 'Ferry to Karaköy', ru: 'Паром в Каракёй', tr: 'Karaköy’e vapur' },
        body: {
          en: 'Twenty minutes across the water with a glass of tea and gulls following the deck. The best-value view in the city.',
          ru: 'Двадцать минут по воде со стаканом чая и чайками за кормой. Лучший вид в городе по соотношению цены и качества.',
          tr: 'Elinizde bir bardak çay, güverteyi izleyen martılarla yirmi dakika. Şehrin en hesaplı manzarası.',
        },
      },
      {
        time: '17:00',
        title: { en: 'Karaköy tastings', ru: 'Дегустации в Каракёе', tr: 'Karaköy tadımları' },
        body: {
          en: 'Baklava from a house that ships to three continents, then a lokanta lunch counter serving the same twelve dishes it did in 1890.',
          ru: 'Пахлава от дома, отправляющего заказы на три континента, затем прилавок локанты с теми же двенадцатью блюдами, что и в 1890 году.',
          tr: 'Üç kıtaya gönderim yapan bir evden baklava, ardından 1890’dan beri aynı on iki yemeği veren bir lokanta tezgâhı.',
        },
      },
      {
        time: '19:00',
        title: { en: 'Meyhane', ru: 'Мейхане', tr: 'Meyhane' },
        body: {
          en: 'The long table. Cold meze arrive first and keep arriving; hot meze follow; fish if the morning catch justified it. This is where the evening stops being a tour.',
          ru: 'Длинный стол. Сначала холодные мезе, и они не заканчиваются; затем горячие; рыба, если утренний улов того стоил. Здесь вечер перестаёт быть экскурсией.',
          tr: 'Uzun sofra. Önce soğuk mezeler gelir ve gelmeye devam eder; sonra sıcaklar; sabahki tezgâh hak ettiyse balık. Akşamın tur olmaktan çıktığı yer burasıdır.',
        },
      },
    ],
    includes: [
      { en: 'Chef-guide for the full afternoon and evening', ru: 'Шеф-гид на весь вечер', tr: 'Tüm öğleden sonra ve akşam için şef-rehber' },
      { en: 'All seven tastings and the meyhane dinner', ru: 'Все семь дегустаций и ужин в мейхане', tr: 'Yedi tadımın tamamı ve meyhane yemeği' },
      { en: 'Ferry tickets and all transfers', ru: 'Билеты на паром и все трансферы', tr: 'Vapur biletleri ve tüm transferler' },
      { en: 'Rakı, wine or soft drinks at dinner', ru: 'Ракы, вино или безалкогольные напитки за ужином', tr: 'Yemekte rakı, şarap veya alkolsüz içecekler' },
    ],
    excludes: [
      { en: 'Additional bottles beyond the table service', ru: 'Дополнительные бутылки сверх обслуживания стола', tr: 'Sofra servisinin ötesindeki ek şişeler' },
      { en: 'Produce you decide to take home', ru: 'Продукты, которые вы решите взять с собой', tr: 'Eve götürmeye karar verdiğiniz ürünler' },
    ],
    good_to_know: {
      en: 'Vegetarian, halal, gluten-free and nut allergies are all workable. Tell us at booking and the route changes rather than the substitutions being apologised for. Roughly 3km of walking, mostly flat, with the market cobbles the only rough patch.',
      ru: 'Вегетарианское, халяль, без глютена, аллергия на орехи, всё решаемо. Сообщите при бронировании: изменится маршрут, а не появятся извинения за замены. Около 3 км пешком, в основном по ровному; сложный участок, брусчатка рынка.',
      tr: 'Vejetaryen, helal, glutensiz ve fındık alerjisi: hepsi çözülebilir. Rezervasyonda bize söyleyin; ikame için özür dilenmesi yerine rota değişsin. Yaklaşık 3 km yürüyüş, çoğu düz; tek zorlu kısım pazarın arnavut kaldırımı.',
    },
  },

  {
    slug: 'bosphorus-shores',
    category: 'bosphorus',
    featured: true,
    durationHours: 7,
    maxGuests: 8,
    priceFrom: 1450,
    currency: 'EUR',
    coverImage: 'bosphorus-mansion.webp',
    images: ['bosphorus-mansion.webp', 'rumeli-fortress.webp', 'bebek-morning.webp', 'anadolu-kavagi.webp', 'boat-deck.webp'],
    title: {
      en: 'Bosphorus Shores',
      ru: 'Берега Босфора',
      tr: 'Boğaz Kıyıları',
    },
    summary: {
      en: 'The strait from the water and the shore both: private boat one way, chauffeured car the other.',
      ru: 'Пролив с воды и с берега, частный катер в одну сторону, автомобиль с водителем в другую.',
      tr: 'Boğaz hem sudan hem karadan: bir yön özel tekne, diğeri şoförlü araç.',
    },
    description: {
      en: 'Most Bosphorus tours put you on a boat for two hours and call it done. This one alternates. You board a private wooden boat at Ortaköy, run north past the yalıs, the waterfront mansions that changed hands between viziers and shipping families, and step off at Anadolu Kavağı for lunch above the Black Sea mouth. The return is by road, down the Asian shore, stopping where the boat could not: Küçüksu, Kandilli, the tea gardens under the second bridge.',
      ru: 'Большинство босфорских туров сажают вас на катер на два часа, и на этом всё. Здесь иначе. Вы садитесь на частную деревянную лодку в Ортакёе, идёте на север мимо ялы, прибрежных особняков, переходивших от визирей к судовладельцам, и сходите на берег в Анадолу Кавагы на обед над устьем Чёрного моря. Обратно, по суше, вдоль азиатского берега, с остановками там, куда не подойти по воде: Кючюксу, Кандилли, чайные сады под вторым мостом.',
      tr: 'Çoğu Boğaz turu sizi iki saat tekneye bindirip işi bitmiş sayar. Bu farklı. Ortaköy’den özel ahşap bir tekneye biner, yalıların, vezirlerle armatör aileleri arasında el değiştiren kıyı konaklarının, önünden kuzeye çıkar ve Karadeniz ağzına bakan Anadolu Kavağı’nda öğle yemeği için karaya inersiniz. Dönüş karayoluyla, Anadolu yakasından, teknenin yanaşamayacağı yerlerde durarak: Küçüksu, Kandilli, ikinci köprünün altındaki çay bahçeleri.',
    },
    highlights: [
      { en: 'Private boat, your party only, no shared deck', ru: 'Частная лодка, только ваша компания, без общей палубы', tr: 'Özel tekne, yalnızca sizin grubunuz, ortak güverte yok' },
      { en: 'Yalı-by-yalı commentary from someone who knows whose house it was', ru: 'Комментарий по каждой ялы от того, кто знает, чей это был дом', tr: 'Evin kime ait olduğunu bilen birinden yalı yalı anlatım' },
      { en: 'Fish lunch at Anadolu Kavağı, above the Black Sea entrance', ru: 'Рыбный обед в Анадолу Кавагы, над входом в Чёрное море', tr: 'Karadeniz girişine bakan Anadolu Kavağı’nda balık öğle yemeği' },
      { en: 'Return along the Asian shore by car, stopping at will', ru: 'Обратный путь по азиатскому берегу на машине, с остановками по желанию', tr: 'Anadolu yakasından araçla dönüş, istediğiniz yerde durarak' },
    ],
    itinerary: [
      {
        time: '09:30',
        title: { en: 'Board at Ortaköy', ru: 'Посадка в Ортакёе', tr: 'Ortaköy’de biniş' },
        body: {
          en: 'Under the first bridge, with the mosque on the water behind you. Coffee and simit on deck as we pull out.',
          ru: 'Под первым мостом, с мечетью на воде за спиной. Кофе и симит на палубе на отходе.',
          tr: 'İlk köprünün altında, arkanızda suyun üstündeki camiyle. Kalkarken güvertede kahve ve simit.',
        },
      },
      {
        time: '10:00',
        title: { en: 'The yalı run', ru: 'Проход вдоль ялы', tr: 'Yalı hattı' },
        body: {
          en: 'Bebek, Rumeli Hisarı, the Fatih bridge, Emirgan. Ninety minutes of waterfront architecture at a speed that lets you actually look at it.',
          ru: 'Бебек, Румели Хисары, мост Фатиха, Эмирган. Полтора часа прибрежной архитектуры на скорости, позволяющей действительно её рассмотреть.',
          tr: 'Bebek, Rumeli Hisarı, Fatih köprüsü, Emirgan. Gerçekten bakmanıza izin veren bir hızda doksan dakikalık kıyı mimarisi.',
        },
      },
      {
        time: '12:30',
        title: { en: 'Anadolu Kavağı', ru: 'Анадолу Кавагы', tr: 'Anadolu Kavağı' },
        body: {
          en: 'Lunch on a terrace where the strait opens into the Black Sea. Whatever came in that morning, grilled simply, with the Genoese castle above you.',
          ru: 'Обед на террасе, где пролив открывается в Чёрное море. Что поймали утром, просто на гриле, под генуэзской крепостью.',
          tr: 'Boğazın Karadeniz’e açıldığı bir terasta öğle yemeği. O sabah ne geldiyse, sade ızgara, tepenizde Ceneviz kalesiyle.',
        },
      },
      {
        time: '14:30',
        title: { en: 'South by road', ru: 'На юг по суше', tr: 'Karayoluyla güneye' },
        body: {
          en: 'The car meets the boat. Down the Asian shore through Beykoz and Kanlıca, yoghurt stop obligatory, to the Küçüksu pavilion.',
          ru: 'Автомобиль встречает лодку. Вниз по азиатскому берегу через Бейкоз и Канлыджу, остановка на йогурт обязательна, до павильона Кючюксу.',
          tr: 'Araç tekneyle buluşur. Beykoz ve Kanlıca üzerinden Anadolu yakasından aşağı, yoğurt molası şart, Küçüksu Kasrı’na.',
        },
      },
      {
        time: '16:30',
        title: { en: 'Çamlıca for the light', ru: 'Чамлыджа на закате', tr: 'Işık için Çamlıca' },
        body: {
          en: 'The hill the whole city is visible from. We time this for the hour before sunset, then run you back across.',
          ru: 'Холм, с которого виден весь город. Приезжаем за час до заката, затем возвращаемся на другой берег.',
          tr: 'Tüm şehrin göründüğü tepe. Bunu gün batımından önceki saate ayarlar, sonra sizi karşıya geçiririz.',
        },
      },
    ],
    includes: [
      { en: 'Private boat with captain and crew, four hours', ru: 'Частная лодка с капитаном и экипажем, четыре часа', tr: 'Kaptan ve mürettebatla özel tekne, dört saat' },
      { en: 'Chauffeured vehicle for the return leg', ru: 'Автомобиль с водителем на обратный путь', tr: 'Dönüş için şoförlü araç' },
      { en: 'Licensed guide throughout', ru: 'Лицензированный гид на протяжении всего дня', tr: 'Gün boyu lisanslı rehber' },
      { en: 'Fish lunch with drinks at Anadolu Kavağı', ru: 'Рыбный обед с напитками в Анадолу Кавагы', tr: 'Anadolu Kavağı’nda içeceklerle balık öğle yemeği' },
      { en: 'Refreshments on board', ru: 'Напитки на борту', tr: 'Teknede ikramlar' },
    ],
    excludes: [
      { en: 'Küçüksu pavilion entry, if you choose to go in', ru: 'Вход в павильон Кючюксу, если захотите зайти', tr: 'İsterseniz Küçüksu Kasrı girişi' },
      { en: 'Gratuities for the boat crew', ru: 'Чаевые экипажу', tr: 'Tekne mürettebatı için bahşiş' },
    ],
    good_to_know: {
      en: 'The strait can be choppy between November and March; we will tell you honestly the day before and move the sailing leg or reschedule at no cost. Bring a layer. It is consistently colder on the water than the forecast suggests.',
      ru: 'С ноября по март на проливе бывает волнение. Мы честно предупредим накануне и перенесём морскую часть или всю программу без доплат. Возьмите тёплый слой, на воде всегда холоднее, чем обещает прогноз.',
      tr: 'Kasım–Mart arası Boğaz dalgalı olabilir; bir gün önce size dürüstçe söyler, deniz bölümünü değiştirir ya da ücretsiz erteleriz. Bir kat fazla giyinin. Suda hava daima tahminden serindir.',
    },
  },

  {
    slug: 'byzantine-hours',
    category: 'heritage',
    featured: false,
    durationHours: 6,
    maxGuests: 6,
    priceFrom: 740,
    currency: 'EUR',
    coverImage: 'chora-mosaic.webp',
    images: ['chora-mosaic.webp', 'balat-street.webp', 'theodosian-walls.webp', 'fener-church.webp'],
    title: {
      en: 'Byzantine Hours',
      ru: 'Византийские часы',
      tr: 'Bizans Saatleri',
    },
    summary: {
      en: 'Constantinople underneath Istanbul. Chora, the land walls, and the neighbourhoods that never converted.',
      ru: 'Константинополь под Стамбулом, Хора, сухопутные стены и кварталы, которые так и не сменили веру.',
      tr: 'İstanbul’un altındaki Konstantinopolis. Kariye, kara surları ve hiç dönüşmemiş mahalleler.',
    },
    description: {
      en: 'For travellers who have already done Sultanahmet, or who would rather skip it. This is the Greek city: the Chora mosaics, which are the finest late-Byzantine painting anywhere; the Theodosian walls that held for a thousand years; and Fener and Balat, where the Ecumenical Patriarchate still operates on a street of wooden houses painted every colour. Led by a specialist in Byzantine art, at a pace that assumes you are interested.',
      ru: 'Для тех, кто уже видел Султанахмет, или предпочёл бы его пропустить. Это греческий город: мозаики Хоры, лучшая поздневизантийская живопись в мире; Феодосиевы стены, державшиеся тысячу лет; Фенер и Балат, где Вселенский патриархат по-прежнему работает на улице разноцветных деревянных домов. Ведёт специалист по византийскому искусству, в темпе, предполагающем, что вам действительно интересно.',
      tr: 'Sultanahmet’i çoktan görmüş ya da atlamayı tercih edenler için. Bu, Rum şehri: her yerdeki en iyi geç Bizans resmi olan Kariye mozaikleri; bin yıl dayanan Theodosius surları; ve Ekümenik Patrikhane’nin hâlâ her rengine boyanmış ahşap evlerden oluşan bir sokakta faaliyet gösterdiği Fener ile Balat. Bizans sanatı uzmanı bir rehberle, ilgili olduğunuzu varsayan bir tempoda.',
    },
    highlights: [
      { en: 'Chora (Kariye) mosaics and frescoes with an art historian', ru: 'Мозаики и фрески Хоры (Карие) с историком искусства', tr: 'Sanat tarihçisiyle Kariye mozaik ve freskleri' },
      { en: 'The Theodosian land walls, walked not driven past', ru: 'Феодосиевы стены, пешком, а не мимо на машине', tr: 'Theodosius kara surları, yanından geçilerek değil, yürünerek' },
      { en: 'Fener, Balat and the Ecumenical Patriarchate', ru: 'Фенер, Балат и Вселенский патриархат', tr: 'Fener, Balat ve Ekümenik Patrikhane' },
      { en: 'Coffee in a Balat courtyard, away from the photo queue', ru: 'Кофе во дворе в Балате, вдали от очереди за фото', tr: 'Fotoğraf kuyruğundan uzakta, bir Balat avlusunda kahve' },
    ],
    itinerary: [
      {
        time: '09:30',
        title: { en: 'Chora', ru: 'Хора', tr: 'Kariye' },
        body: {
          en: 'Two hours. The Anastasis in the parekklesion alone justifies the trip; the rest of the narthex cycle is the reason art historians come to Istanbul.',
          ru: 'Два часа. Один только «Сошествие во ад» в параклесионе оправдывает поездку; остальной цикл нартекса, причина, по которой историки искусства едут в Стамбул.',
          tr: 'İki saat. Parekklesion’daki Anastasis tek başına yolculuğu haklı çıkarır; narteks döngüsünün geri kalanı ise sanat tarihçilerinin İstanbul’a gelme sebebidir.',
        },
      },
      {
        time: '11:45',
        title: { en: 'The walls', ru: 'Стены', tr: 'Surlar' },
        body: {
          en: 'Edirnekapı to the Blachernae section on foot. Three lines of defence, a moat, and the breach point of 1453.',
          ru: 'От Эдирнекапы до Влахерн пешком. Три линии обороны, ров и место прорыва 1453 года.',
          tr: 'Edirnekapı’dan Blakhernai bölümüne yürüyerek. Üç savunma hattı, hendek ve 1453’ün gedik noktası.',
        },
      },
      {
        time: '13:00',
        title: { en: 'Lunch in Fener', ru: 'Обед в Фенере', tr: 'Fener’de öğle yemeği' },
        body: {
          en: 'A neighbourhood table, no view, excellent food, the kind of place a guide eats on a day off.',
          ru: 'Районный стол, без вида, с отличной едой; такое место, где гид ест в выходной.',
          tr: 'Mahalle masası, manzarasız, yemeği mükemmel; bir rehberin izin gününde yediği türden bir yer.',
        },
      },
      {
        time: '14:30',
        title: { en: 'Patriarchate & Balat', ru: 'Патриархат и Балат', tr: 'Patrikhane ve Balat' },
        body: {
          en: 'St George’s and the patriarchal throne, then uphill through Balat: the Ahrida synagogue, the iron church at Sveti Stefan, and streets that were Jewish, Greek and Armenian on the same block.',
          ru: 'Собор Святого Георгия и патриарший трон, затем вверх через Балат: синагога Ахрида, железная церковь Свети Стефан и улицы, где на одном квартале жили евреи, греки и армяне.',
          tr: 'Aya Yorgi ve patriklik tahtı, ardından yokuş yukarı Balat: Ahrida Sinagogu, Sveti Stefan demir kilisesi ve aynı sokakta Yahudi, Rum ve Ermeni olan mahalleler.',
        },
      },
    ],
    includes: [
      { en: 'Byzantine art specialist for the full day', ru: 'Специалист по византийскому искусству на весь день', tr: 'Tam gün Bizans sanatı uzmanı' },
      { en: 'Chora and all site entries', ru: 'Хора и все входные билеты', tr: 'Kariye ve tüm giriş biletleri' },
      { en: 'Private vehicle and driver', ru: 'Частный автомобиль с водителем', tr: 'Özel araç ve şoför' },
      { en: 'Neighbourhood lunch', ru: 'Обед в местном ресторане', tr: 'Mahalle lokantasında öğle yemeği' },
    ],
    excludes: [
      { en: 'Gratuities', ru: 'Чаевые', tr: 'Bahşişler' },
    ],
    good_to_know: {
      en: 'Balat is steep and cobbled. Flat shoes matter here more than on any other itinerary. The Patriarchate closes to visitors during services; we check the schedule the week of your visit.',
      ru: 'Балат, крутые улицы и брусчатка: удобная обувь здесь важнее, чем на любом другом маршруте. Патриархат закрыт для посетителей во время служб; расписание мы проверяем на неделе вашего визита.',
      tr: 'Balat dik ve arnavut kaldırımlı; düz ayakkabı burada diğer tüm programlardan daha önemli. Patrikhane ayin sırasında ziyarete kapalıdır; programı ziyaretinizin haftasında kontrol ederiz.',
    },
  },

  {
    slug: 'bazaar-sourcing',
    category: 'shopping',
    featured: false,
    durationHours: 5,
    maxGuests: 4,
    priceFrom: 580,
    currency: 'EUR',
    coverImage: 'grand-bazaar-arch.webp',
    images: ['grand-bazaar-arch.webp', 'carpet-pile.webp', 'jeweller-workshop.webp', 'spice-bazaar.webp'],
    title: {
      en: 'Bazaar Sourcing',
      ru: 'Закупка на базаре',
      tr: 'Çarşıda Alım',
    },
    summary: {
      en: 'The Grand Bazaar with a buyer on your side of the table: authentication, fair price, no commission.',
      ru: 'Гранд-базар с байером на вашей стороне стола, экспертиза, честная цена, без комиссии.',
      tr: 'Kapalıçarşı’da masanın sizin tarafınızda bir alıcı: ekspertiz, adil fiyat, komisyonsuz.',
    },
    description: {
      en: 'Every guide in the Grand Bazaar takes a commission. Ours does not, and that is the entire product. You go in with an independent buyer who has spent twenty years in the carpet and antique trade, who will tell you when a "Hereke silk" is a machine-made copy, what a fair price actually is, and when to walk. If you buy nothing, that is a successful day. If you buy, you will have paid what a dealer pays.',
      ru: 'Каждый гид на Гранд-базаре получает комиссию. Наш, нет, и в этом весь смысл. Вы идёте с независимым байером, двадцать лет проработавшим в ковровой и антикварной торговле: он скажет, когда «шёлк Херекé», машинная копия, какая цена справедлива и когда пора уйти. Если вы ничего не купите, день прошёл успешно. Если купите, заплатите как дилер.',
      tr: 'Kapalıçarşı’daki her rehber komisyon alır. Bizimki almaz ve ürünün tamamı budur. İçeri, halı ve antika ticaretinde yirmi yıl geçirmiş bağımsız bir alıcıyla girersiniz: bir “Hereke ipeği”nin makine kopyası olduğunu, gerçek adil fiyatın ne olduğunu ve ne zaman çekip gitmeniz gerektiğini söyler. Hiçbir şey almazsanız, gün başarılıdır. Alırsanız, bir tüccarın ödediğini ödemiş olursunuz.',
    },
    highlights: [
      { en: 'Independent buyer, we take no commission from any shop, ever', ru: 'Независимый байер, мы никогда не берём комиссию с магазинов', tr: 'Bağımsız alıcı, hiçbir dükkândan asla komisyon almayız' },
      { en: 'Carpet, kilim, ceramic and antique authentication on the spot', ru: 'Экспертиза ковров, килимов, керамики и антиквариата на месте', tr: 'Yerinde halı, kilim, seramik ve antika ekspertizi' },
      { en: 'Access to the workshops behind the shopfronts', ru: 'Доступ в мастерские за витринами', tr: 'Vitrinlerin arkasındaki atölyelere erişim' },
      { en: 'Shipping, customs and export paperwork handled', ru: 'Доставка, таможня и экспортные документы, на нас', tr: 'Kargo, gümrük ve ihracat evrakları halledilir' },
    ],
    itinerary: [
      {
        time: '10:00',
        title: { en: 'Briefing over coffee', ru: 'Брифинг за кофе', tr: 'Kahve eşliğinde bilgilendirme' },
        body: {
          en: 'What you are looking for, what you should expect to pay for it, and how the bargaining actually works. Twenty minutes that changes the whole day.',
          ru: 'Что вы ищете, сколько это должно стоить и как на самом деле работает торг. Двадцать минут, которые меняют весь день.',
          tr: 'Ne aradığınız, bunun için ne ödemeniz gerektiği ve pazarlığın gerçekte nasıl işlediği. Tüm günü değiştiren yirmi dakika.',
        },
      },
      {
        time: '10:30',
        title: { en: 'The Bazaar', ru: 'Базар', tr: 'Çarşı' },
        body: {
          en: 'The İç Bedesten first, the oldest core, where the genuinely old objects are, then the streets by trade: goldsmiths, textile, leather.',
          ru: 'Сначала Ич Бедестен, древнейшее ядро, где действительно старые вещи, затем улицы по ремёслам: ювелиры, ткани, кожа.',
          tr: 'Önce İç Bedesten, gerçekten eski nesnelerin bulunduğu en eski çekirdek, sonra esnafa göre sokaklar: kuyumcular, tekstil, deri.',
        },
      },
      {
        time: '13:00',
        title: { en: 'Lunch in a han', ru: 'Обед в хане', tr: 'Handa öğle yemeği' },
        body: {
          en: 'One of the caravanserai courtyards inside the bazaar walls, where the traders eat.',
          ru: 'Один из караван-сарайных дворов внутри стен базара, где обедают сами торговцы.',
          tr: 'Çarşı duvarlarının içinde, esnafın yemek yediği kervansaray avlularından biri.',
        },
      },
      {
        time: '14:00',
        title: { en: 'Spice Bazaar & Tahtakale', ru: 'Египетский базар и Тахтакале', tr: 'Mısır Çarşısı ve Tahtakale' },
        body: {
          en: 'Saffron graded properly, pistachios by origin, and the back streets where the restaurant kitchens buy, half the price of the bazaar frontage.',
          ru: 'Правильно отсортированный шафран, фисташки по происхождению и переулки, где закупаются ресторанные кухни, вдвое дешевле, чем на фасаде базара.',
          tr: 'Doğru derecelendirilmiş safran, menşeine göre antep fıstığı ve restoran mutfaklarının alışveriş yaptığı arka sokaklar, çarşı cephesinin yarı fiyatına.',
        },
      },
    ],
    includes: [
      { en: 'Independent buyer-guide, five hours', ru: 'Независимый байер-гид, пять часов', tr: 'Bağımsız alıcı-rehber, beş saat' },
      { en: 'Authentication opinion on anything you consider', ru: 'Экспертное мнение по любой рассматриваемой покупке', tr: 'Değerlendirdiğiniz her şey için ekspertiz görüşü' },
      { en: 'Lunch inside the bazaar', ru: 'Обед на территории базара', tr: 'Çarşı içinde öğle yemeği' },
      { en: 'Private vehicle to and from your hotel', ru: 'Частный автомобиль от отеля и обратно', tr: 'Otelinize gidiş-dönüş özel araç' },
      { en: 'Export documentation and shipping arranged', ru: 'Оформление экспорта и доставка', tr: 'İhracat belgeleri ve kargo düzenlemesi' },
    ],
    excludes: [
      { en: 'Your purchases, obviously', ru: 'Сами покупки, разумеется', tr: 'Alışverişleriniz, doğal olarak' },
      { en: 'Shipping costs, quoted at cost with no markup', ru: 'Стоимость доставки, по себестоимости, без наценки', tr: 'Kargo bedeli, maliyetine, kâr eklenmeden' },
    ],
    good_to_know: {
      en: 'Antiques over 100 years old cannot legally leave Türkiye. Your buyer knows the line precisely and will steer you away from anything that would be seized at the airport. Cards are accepted almost everywhere, but cash still moves the price.',
      ru: 'Антиквариат старше 100 лет вывозить из Турции запрещено. Ваш байер точно знает границу и уведёт вас от всего, что изымут в аэропорту. Карты принимают почти везде, но наличные по-прежнему двигают цену.',
      tr: '100 yaşından eski antikalar Türkiye’den yasal olarak çıkarılamaz. Alıcınız sınırı tam olarak bilir ve havalimanında el konulacak hiçbir şeye yönelmenize izin vermez. Kart neredeyse her yerde geçer, ama fiyatı hâlâ nakit oynatır.',
    },
  },

  {
    slug: 'princes-islands',
    category: 'escape',
    featured: false,
    durationHours: 9,
    maxGuests: 8,
    priceFrom: 1180,
    currency: 'EUR',
    coverImage: 'buyukada-house.webp',
    images: ['buyukada-house.webp', 'island-pine-road.webp', 'island-jetty.webp', 'aya-yorgi-view.webp'],
    title: {
      en: 'The Princes’ Islands',
      ru: 'Принцевы острова',
      tr: 'Adalar',
    },
    summary: {
      en: 'A car-free island of pine forest and wooden mansions, ninety minutes from the city and a century away from it.',
      ru: 'Остров без автомобилей: сосновый лес и деревянные особняки, полтора часа от города и век от него.',
      tr: 'Arabasız bir ada: çam ormanı ve ahşap köşkler, şehirden doksan dakika, bir yüzyıl uzakta.',
    },
    description: {
      en: 'Büyükada has no cars. It has pine forest, Belle Époque timber mansions in every state from immaculate to romantically collapsing, and a monastery at the top of a hill that people still climb barefoot. We take you by private boat rather than the public ferry, which turns a crowded two-hour trip into a comfortable ninety minutes, and we have an electric cart waiting so the island is actually crossable in a day.',
      ru: 'На Бююкаде нет машин. Есть сосновый лес, деревянные особняки Прекрасной эпохи, от безупречных до романтично разрушающихся, и монастырь на вершине холма, куда до сих пор поднимаются босиком. Мы везём вас частным катером, а не общественным паромом: переполненные два часа превращаются в комфортные полтора. На острове ждёт электрокар, иначе за день его не пересечь.',
      tr: 'Büyükada’da araba yok. Çam ormanı, kusursuzdan romantik biçimde çökmekte olana kadar her hâlde Belle Époque ahşap köşkler ve insanların hâlâ yalınayak çıktığı bir tepede manastır var. Sizi toplu vapurla değil özel tekneyle götürürüz; kalabalık iki saat, rahat doksan dakikaya döner. Adada elektrikli araç bekler, böylece ada bir günde gerçekten gezilebilir.',
    },
    highlights: [
      { en: 'Private boat transfer, not the public ferry', ru: 'Трансфер частным катером, а не общественным паромом', tr: 'Toplu vapur değil, özel tekne transferi' },
      { en: 'Electric cart and driver for the whole island', ru: 'Электрокар с водителем на весь остров', tr: 'Tüm ada için elektrikli araç ve sürücü' },
      { en: 'Aya Yorgi monastery and the view back to the city', ru: 'Монастырь Айя Йорги и вид на город', tr: 'Aya Yorgi Manastırı ve şehre bakan manzara' },
      { en: 'Long lunch at a jetty table', ru: 'Долгий обед за столом на причале', tr: 'İskele masasında uzun bir öğle yemeği' },
    ],
    itinerary: [
      {
        time: '09:00',
        title: { en: 'Departure', ru: 'Отправление', tr: 'Kalkış' },
        body: {
          en: 'From a private jetty on the European side. Breakfast on board as the city recedes.',
          ru: 'С частного причала на европейской стороне. Завтрак на борту, пока город отдаляется.',
          tr: 'Avrupa yakasındaki özel bir iskeleden. Şehir uzaklaşırken teknede kahvaltı.',
        },
      },
      {
        time: '10:30',
        title: { en: 'Büyükada', ru: 'Бююкада', tr: 'Büyükada' },
        body: {
          en: 'The mansion circuit through the pine woods: Trotsky’s house, the wooden orphanage, the largest timber building in Europe, and the streets where Istanbul’s Greek and Jewish families summered.',
          ru: 'Круг по особнякам через сосновый лес: дом Троцкого, деревянный приют, крупнейшее деревянное здание Европы, и улицы, где летовали греческие и еврейские семьи Стамбула.',
          tr: 'Çam ormanı içinden köşk turu: Troçki’nin evi, Avrupa’nın en büyük ahşap yapısı olan yetimhane ve İstanbul’un Rum ve Yahudi ailelerinin yazladığı sokaklar.',
        },
      },
      {
        time: '12:30',
        title: { en: 'Aya Yorgi', ru: 'Айя Йорги', tr: 'Aya Yorgi' },
        body: {
          en: 'Up the hill by cart, the last stretch on foot. A small chapel, a very large view, and a terrace that serves cold wine.',
          ru: 'Наверх на электрокаре, последний отрезок пешком. Маленькая часовня, очень большой вид и терраса с холодным вином.',
          tr: 'Tepeye araçla, son bölüm yürüyerek. Küçük bir şapel, çok büyük bir manzara ve soğuk şarap veren bir teras.',
        },
      },
      {
        time: '14:30',
        title: { en: 'Lunch by the water', ru: 'Обед у воды', tr: 'Su kenarında öğle yemeği' },
        body: {
          en: 'Slow, seated, unhurried. This is an island, the schedule is a suggestion from here on.',
          ru: 'Медленно, за столом, без спешки. Это остров, дальше расписание становится рекомендацией.',
          tr: 'Yavaş, oturarak, acelesiz. Burası bir ada, buradan sonra program bir öneridir.',
        },
      },
      {
        time: '17:30',
        title: { en: 'Sail back', ru: 'Обратный путь', tr: 'Dönüş' },
        body: {
          en: 'The city skyline coming up out of the haze on the return leg is the best thing about going.',
          ru: 'Силуэт города, встающий из дымки на обратном пути, лучшее в этой поездке.',
          tr: 'Dönüşte pustan yükselen şehir silueti, gitmenin en güzel yanıdır.',
        },
      },
    ],
    includes: [
      { en: 'Private boat, both directions, with crew', ru: 'Частный катер в обе стороны с экипажем', tr: 'Mürettebatla çift yön özel tekne' },
      { en: 'Breakfast on board and lunch on the island', ru: 'Завтрак на борту и обед на острове', tr: 'Teknede kahvaltı, adada öğle yemeği' },
      { en: 'Electric cart with driver, all day', ru: 'Электрокар с водителем на весь день', tr: 'Gün boyu sürücülü elektrikli araç' },
      { en: 'Licensed guide', ru: 'Лицензированный гид', tr: 'Lisanslı rehber' },
      { en: 'Hotel transfers at both ends', ru: 'Трансферы от отеля и обратно', tr: 'Her iki uçta otel transferi' },
    ],
    excludes: [{ en: 'Gratuities', ru: 'Чаевые', tr: 'Bahşişler' }],
    good_to_know: {
      en: 'This runs April to October. Outside those months the island is beautiful but most of it is shut. The final climb to Aya Yorgi is 20 minutes on a steep path. We can skip it without affecting the rest of the day.',
      ru: 'Программа работает с апреля по октябрь. В остальные месяцы остров красив, но почти всё закрыто. Последний подъём к Айя Йорги, 20 минут по крутой тропе; его можно пропустить без ущерба для дня.',
      tr: 'Bu program nisan–ekim arası işler. Bu ayların dışında ada güzeldir ama çoğu yer kapalıdır. Aya Yorgi’ye son tırmanış dik bir patikada 20 dakikadır; günün geri kalanını etkilemeden atlayabiliriz.',
    },
  },

  {
    slug: 'istanbul-after-dark',
    category: 'culinary',
    featured: false,
    durationHours: 5,
    maxGuests: 6,
    priceFrom: 690,
    currency: 'EUR',
    coverImage: 'rooftop-night.webp',
    images: ['rooftop-night.webp', 'sema-ceremony.webp', 'bosphorus-bridge-night.webp', 'jazz-cellar.webp'],
    title: {
      en: 'Istanbul After Dark',
      ru: 'Стамбул после заката',
      tr: 'Karanlıktan Sonra İstanbul',
    },
    summary: {
      en: 'Sunset from the water, dinner above the rooftops, and whichever end you choose: a sema ceremony or a jazz cellar.',
      ru: 'Закат с воды, ужин над крышами и финал на ваш выбор, церемония сема или джазовый подвал.',
      tr: 'Sudan gün batımı, çatıların üstünde akşam yemeği ve seçtiğiniz final: sema töreni ya da bir caz mahzeni.',
    },
    description: {
      en: 'The city is better at night and almost nobody organises it properly. We start on the water for the hour the light is worth something, move to a rooftop table booked on the right side for the view, and then split the ending: the Mevlevi sema ceremony in a 15th-century lodge, or a jazz cellar in Beyoğlu that has been running since the sixties. Tell us which when you book, or decide at dinner.',
      ru: 'Ночью город лучше, и почти никто не организует это как следует. Начинаем на воде в тот час, когда свет чего-то стоит, переходим за столик на крыше, забронированный с нужной стороны, а финал, на выбор: церемония сема ордена Мевлеви в текке XV века или джазовый подвал в Бейоглу, работающий с шестидесятых. Скажите при бронировании, или решите за ужином.',
      tr: 'Şehir geceleri daha iyidir ve neredeyse hiç kimse bunu düzgün organize etmez. Işığın bir değer taşıdığı saatte suda başlar, manzara için doğru tarafta ayrılmış bir çatı masasına geçer ve finali ikiye ayırırız: 15. yüzyıldan kalma bir tekkede Mevlevi sema töreni ya da altmışlardan beri çalışan bir Beyoğlu caz mahzeni. Rezervasyonda söyleyin ya da yemekte karar verin.',
    },
    highlights: [
      { en: 'Golden hour on the Bosphorus by private boat', ru: 'Золотой час на Босфоре на частном катере', tr: 'Özel tekneyle Boğaz’da altın saat' },
      { en: 'Rooftop dinner, table booked for the view not the room', ru: 'Ужин на крыше, столик выбран ради вида, а не зала', tr: 'Çatıda akşam yemeği, masa manzaraya göre ayrılır' },
      { en: 'Your choice of finale: sema ceremony or live jazz', ru: 'Финал на выбор: церемония сема или живой джаз', tr: 'Finali siz seçin: sema töreni ya da canlı caz' },
      { en: 'Car and driver on call until you are done', ru: 'Автомобиль с водителем, пока вечер не закончится', tr: 'Siz bitirene kadar emrinizde araç ve şoför' },
    ],
    itinerary: [
      {
        time: '17:30',
        title: { en: 'On the water', ru: 'На воде', tr: 'Suda' },
        body: {
          en: 'Ninety minutes as the light goes. The mosques switch their floodlights on one by one; it is the single best thing the city does.',
          ru: 'Полтора часа, пока уходит свет. Мечети зажигают подсветку одна за другой, лучшее, на что способен этот город.',
          tr: 'Işık kaybolurken doksan dakika. Camiler ışıklarını teker teker yakar; şehrin yaptığı en güzel şey budur.',
        },
      },
      {
        time: '19:30',
        title: { en: 'Dinner above the rooftops', ru: 'Ужин над крышами', tr: 'Çatıların üstünde akşam yemeği' },
        body: {
          en: 'Modern Anatolian cooking, a proper wine list of Turkish producers, and the old city lit up in front of you.',
          ru: 'Современная анатолийская кухня, серьёзная карта турецких вин и подсвеченный старый город перед вами.',
          tr: 'Modern Anadolu mutfağı, Türk üreticilerden ciddi bir şarap listesi ve önünüzde ışıklandırılmış tarihi yarımada.',
        },
      },
      {
        time: '21:30',
        title: { en: 'The ending you chose', ru: 'Выбранный вами финал', tr: 'Seçtiğiniz final' },
        body: {
          en: 'Either the sema, a religious ceremony, not a show, and we will brief you on how to be in the room, or a cellar with a trio and no cover charge for you.',
          ru: 'Либо сема, религиозная церемония, а не шоу; мы объясним, как правильно находиться в зале, либо подвал с трио и без входной платы для вас.',
          tr: 'Ya sema, bir gösteri değil, dinî bir tören; salonda nasıl bulunacağınızı size anlatırız, ya da bir trio ve sizin için giriş ücreti olmayan bir mahzen.',
        },
      },
    ],
    includes: [
      { en: 'Private boat for the sunset leg', ru: 'Частный катер на закатную часть', tr: 'Gün batımı bölümü için özel tekne' },
      { en: 'Rooftop dinner with wine pairing', ru: 'Ужин на крыше с подбором вин', tr: 'Şarap eşleştirmeli çatı yemeği' },
      { en: 'Sema ceremony seats or jazz club entry', ru: 'Места на церемонии сема или вход в джаз-клуб', tr: 'Sema töreni yerleri veya caz kulübü girişi' },
      { en: 'Guide and chauffeured car all evening', ru: 'Гид и автомобиль с водителем на весь вечер', tr: 'Tüm akşam rehber ve şoförlü araç' },
    ],
    excludes: [
      { en: 'Additional bottles at dinner', ru: 'Дополнительные бутылки за ужином', tr: 'Yemekte ek şişeler' },
      { en: 'Drinks at the jazz club', ru: 'Напитки в джаз-клубе', tr: 'Caz kulübünde içecekler' },
    ],
    good_to_know: {
      en: 'The sema runs on fixed evenings only: usually Sunday, sometimes Thursday. If your dates do not line up we will say so rather than substitute a hotel-lobby version, which is not the same thing. Smart dress for the rooftop.',
      ru: 'Сема проводится только в определённые вечера, обычно по воскресеньям, иногда по четвергам. Если даты не совпадут, мы скажем прямо, а не подменим версией из отельного лобби, это не одно и то же. На крышу, smart dress.',
      tr: 'Sema yalnızca belirli akşamlar yapılır: genellikle pazar, bazen perşembe. Tarihleriniz uymazsa, otel lobisi versiyonuyla değiştirmek yerine bunu açıkça söyleriz; aynı şey değildir. Çatı için şık giyim.',
    },
  },

  {
    slug: 'cappadocia-by-air',
    category: 'escape',
    featured: true,
    durationHours: 16,
    maxGuests: 6,
    priceFrom: 3400,
    currency: 'EUR',
    coverImage: 'cappadocia-balloons.webp',
    images: ['cappadocia-balloons.webp', 'goreme-valley.webp', 'cave-hotel-terrace.webp', 'underground-city.webp'],
    title: {
      en: 'Cappadocia by Air',
      ru: 'Каппадокия по воздуху',
      tr: 'Havadan Kapadokya',
    },
    summary: {
      en: 'Balloons at dawn, rock churches by lunch, back on the Bosphorus for dinner. One very long, very good day.',
      ru: 'Шары на рассвете, пещерные церкви к обеду, ужин снова на Босфоре. Один очень длинный и очень хороший день.',
      tr: 'Şafakta balonlar, öğlene kaya kiliseleri, akşam yemeğinde yine Boğaz. Çok uzun, çok iyi bir gün.',
    },
    description: {
      en: 'Cappadocia is a 75-minute flight, which makes it a day trip if, and only if, the logistics are handled. We put you on the first flight out, have a car and guide waiting on the tarmac side, and get you into a balloon basket before sunrise. Then the valleys, the rock-cut churches at Göreme, an underground city, and a long lunch in a cave. You are back at your Istanbul hotel by nine.',
      ru: 'До Каппадокии 75 минут лёта, а значит, это поездка на день, но только при безупречной логистике. Мы сажаем вас на первый рейс, машина и гид ждут у выхода, и вы оказываетесь в корзине шара ещё до восхода. Затем долины, пещерные церкви Гёреме, подземный город и долгий обед в пещере. К девяти вечера вы снова в отеле в Стамбуле.',
      tr: 'Kapadokya 75 dakikalık bir uçuş; bu da onu günübirlik yapar, ama yalnızca lojistik düzgün yürütülürse. Sizi ilk uçağa bindirir, araç ve rehberi kapıda hazır bulundurur ve gün doğmadan balon sepetine sokarız. Ardından vadiler, Göreme’nin kayaya oyulmuş kiliseleri, bir yeraltı şehri ve mağarada uzun bir öğle yemeği. Akşam dokuzda İstanbul’daki otelinizdesiniz.',
    },
    highlights: [
      { en: 'Balloon flight at sunrise, private basket available', ru: 'Полёт на шаре на рассвете, возможна частная корзина', tr: 'Gün doğumunda balon uçuşu, özel sepet mümkün' },
      { en: 'Return flights and all airport handling arranged', ru: 'Перелёты туда-обратно и все аэропортовые формальности', tr: 'Gidiş-dönüş uçuşlar ve tüm havalimanı işlemleri' },
      { en: 'Göreme rock churches with an archaeologist', ru: 'Пещерные церкви Гёреме с археологом', tr: 'Arkeologla Göreme kaya kiliseleri' },
      { en: 'Private vehicle and guide on the ground all day', ru: 'Частный автомобиль и гид на весь день на месте', tr: 'Gün boyu yerde özel araç ve rehber' },
    ],
    itinerary: [
      {
        time: '03:30',
        title: { en: 'Airport transfer', ru: 'Трансфер в аэропорт', tr: 'Havalimanı transferi' },
        body: {
          en: 'Yes, it is early. Coffee in the car, fast-track through security, and you can sleep on the flight.',
          ru: 'Да, это рано. Кофе в машине, ускоренный проход контроля, и можно поспать в самолёте.',
          tr: 'Evet, erken. Arabada kahve, hızlı geçiş ve uçakta uyuyabilirsiniz.',
        },
      },
      {
        time: '06:00',
        title: { en: 'Lift-off', ru: 'Взлёт', tr: 'Kalkış' },
        body: {
          en: 'An hour in the air over Love Valley and the fairy chimneys, with a hundred other balloons rising around you. Champagne on landing, which is traditional and entirely justified.',
          ru: 'Час в воздухе над Долиной любви и «каминами фей», вокруг поднимается сотня других шаров. Шампанское при приземлении, традиция, полностью оправданная.',
          tr: 'Aşk Vadisi ve peribacaları üzerinde bir saat, etrafınızda yükselen yüz balonla. İnişte şampanya, gelenektir ve tamamen hak edilmiştir.',
        },
      },
      {
        time: '09:30',
        title: { en: 'Göreme', ru: 'Гёреме', tr: 'Göreme' },
        body: {
          en: 'The open-air museum before the coaches: eleventh-century frescoes cut straight into the rock, still holding their colour.',
          ru: 'Музей под открытым небом до автобусов: фрески XI века, вырубленные прямо в скале, до сих пор сохранившие цвет.',
          tr: 'Otobüslerden önce açık hava müzesi: doğrudan kayaya oyulmuş, rengini hâlâ koruyan on birinci yüzyıl freskleri.',
        },
      },
      {
        time: '12:00',
        title: { en: 'Underground', ru: 'Под землёй', tr: 'Yeraltı' },
        body: {
          en: 'Kaymaklı or Derinkuyu, eight levels down, ventilated, with stables, chapels and rolling stone doors. Twenty thousand people once hid here.',
          ru: 'Каймаклы или Деринкую, восемь уровней вниз, с вентиляцией, конюшнями, часовнями и каменными дверями-жерновами. Здесь когда-то прятались двадцать тысяч человек.',
          tr: 'Kaymaklı ya da Derinkuyu, sekiz kat aşağı, havalandırmalı, ahırları, şapelleri ve yuvarlanan taş kapılarıyla. Bir zamanlar yirmi bin kişi burada saklandı.',
        },
      },
      {
        time: '13:30',
        title: { en: 'Lunch in a cave', ru: 'Обед в пещере', tr: 'Mağarada öğle yemeği' },
        body: {
          en: 'Testi kebabı, cooked and broken open at the table, with a local Emir white. Then the valleys at Uçhisar before the flight back.',
          ru: 'Тести-кебаб, приготовленный и разбитый прямо у стола, с местным белым Emir. Затем долины Учхисара перед обратным рейсом.',
          tr: 'Masada pişirilip kırılan testi kebabı, yanında yerli Emir beyazı. Ardından dönüş uçuşundan önce Uçhisar vadileri.',
        },
      },
      {
        time: '20:45',
        title: { en: 'Back in Istanbul', ru: 'Снова в Стамбуле', tr: 'İstanbul’a dönüş' },
        body: {
          en: 'Car waiting at arrivals, hotel by nine. Dinner is on you, and you will want it early.',
          ru: 'Автомобиль ждёт в зоне прилёта, в отеле, к девяти. Ужин за ваш счёт, и он вам понадобится пораньше.',
          tr: 'Araç gelişte bekler, dokuzda oteldesiniz. Akşam yemeği sizden, ve onu erken isteyeceksiniz.',
        },
      },
    ],
    includes: [
      { en: 'Return domestic flights, business class where available', ru: 'Перелёты туда-обратно, бизнес-класс при наличии', tr: 'Gidiş-dönüş iç hat uçuşlar, mümkünse business' },
      { en: 'Balloon flight with a licensed operator and full insurance', ru: 'Полёт на шаре с лицензированным оператором и полной страховкой', tr: 'Lisanslı operatörle ve tam sigortalı balon uçuşu' },
      { en: 'Private guide and vehicle in Cappadocia', ru: 'Частный гид и автомобиль в Каппадокии', tr: 'Kapadokya’da özel rehber ve araç' },
      { en: 'All site entries and cave lunch', ru: 'Все входные билеты и обед в пещере', tr: 'Tüm giriş biletleri ve mağara yemeği' },
      { en: 'Istanbul airport transfers, both ends', ru: 'Трансферы в аэропорт Стамбула в обе стороны', tr: 'Her iki uçta İstanbul havalimanı transferi' },
    ],
    excludes: [
      { en: 'Dinner back in Istanbul', ru: 'Ужин по возвращении в Стамбул', tr: 'İstanbul’a dönüşte akşam yemeği' },
      { en: 'Gratuities for the balloon crew', ru: 'Чаевые экипажу шара', tr: 'Balon ekibi için bahşiş' },
    ],
    good_to_know: {
      en: 'Balloons fly at the discretion of the Turkish civil aviation authority and are grounded for wind roughly one morning in five. If yours is cancelled we refund the balloon portion in full the same day and the rest of the itinerary runs as planned. We do not hold the money against a future booking.',
      ru: 'Полёты шаров разрешает управление гражданской авиации Турции; примерно одно утро из пяти отменяют из-за ветра. Если ваш полёт отменят, мы возвращаем стоимость шара полностью в тот же день, а остальная программа идёт по плану, мы не удерживаем деньги в счёт будущей брони.',
      tr: 'Balonlar Sivil Havacılık Genel Müdürlüğü’nün iznine tabidir ve yaklaşık beş sabahın birinde rüzgâr nedeniyle uçmaz. Uçuşunuz iptal edilirse balon bedelini aynı gün tam olarak iade ederiz ve programın geri kalanı planlandığı gibi işler; parayı ileri bir rezervasyona karşılık tutmayız.',
    },
  },
]

// ---- Lookups ---------------------------------------------------------------

export const featuredExperiences = experiences.filter((e) => e.featured)

export function getExperience(slug) {
  return experiences.find((e) => e.slug === slug)
}

export function experiencesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return experiences
  return experiences.filter((e) => e.category === categoryId)
}

export default experiences
