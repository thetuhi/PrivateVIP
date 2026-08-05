// Policy pages, rendered by src/pages/PolicyPage.jsx at /policy/:slug.
//
// ⚠ These are working drafts written to be readable, not legal advice. Have a
// Turkish lawyer review them before launch, particularly the KVKK section,
// Türkiye's data protection law has its own notice requirements that differ
// from GDPR.

const sections = (arr) => arr

export const policies = {
  terms: {
    slug: 'terms',
    title: { en: 'Booking terms', ru: 'Условия бронирования', tr: 'Rezervasyon koşulları' },
    updated: '2026-01-15',
    intro: {
      en: 'These terms cover every service booked through Private VIP Istanbul. They are written to be read, not to be survived.',
      ru: 'Эти условия распространяются на все услуги, забронированные через Private VIP Istanbul. Они написаны, чтобы их читали, а не преодолевали.',
      tr: 'Bu koşullar Private VIP Istanbul üzerinden alınan tüm hizmetleri kapsar. Okunmak için yazılmışlardır, atlatılmak için değil.',
    },
    sections: sections([
      {
        h: { en: 'What you are booking', ru: 'Что вы бронируете', tr: 'Ne rezerve ediyorsunuz' },
        p: {
          en: 'A private service for your party only. We do not combine bookings, and no third party will join your vehicle, boat or guide. The written itinerary we send you before payment is the agreement; anything not in it is not included.',
          ru: 'Частную услугу только для вашей группы. Мы не объединяем брони, и никто посторонний не присоединится к вашему автомобилю, катеру или гиду. Соглашением считается письменная программа, отправленная до оплаты; всё, чего в ней нет, не включено.',
          tr: 'Yalnızca sizin grubunuz için özel bir hizmet. Rezervasyonları birleştirmeyiz ve aracınıza, teknenize veya rehberinize üçüncü bir taraf katılmaz. Ödemeden önce gönderdiğimiz yazılı program sözleşmedir; içinde olmayan hiçbir şey dâhil değildir.',
        },
      },
      {
        h: { en: 'Payment', ru: 'Оплата', tr: 'Ödeme' },
        p: {
          en: 'A 30% deposit confirms the date (50% for yacht charters and flight-inclusive itineraries, because we settle with those operators in advance). The balance is payable on the day, by card, transfer or cash in EUR, USD or TRY. Prices are quoted inclusive of VAT.',
          ru: 'Предоплата 30% подтверждает дату (50% для яхт-чартеров и программ с перелётом, поскольку мы рассчитываемся с этими операторами заранее). Остаток оплачивается в день программы картой, переводом или наличными в EUR, USD или TRY. Цены указаны с НДС.',
          tr: '%30 ön ödeme tarihi kesinleştirir (yat kiralamaları ve uçuş dâhil programlarda %50, çünkü bu operatörlerle önceden hesaplaşırız). Bakiye gün içinde kart, havale veya EUR, USD ya da TRY nakit ile ödenir. Fiyatlar KDV dâhildir.',
        },
      },
      {
        h: { en: 'Cancellation by you', ru: 'Отмена с вашей стороны', tr: 'Sizin tarafınızdan iptal' },
        p: {
          en: 'Cancel more than 72 hours before the start time and the deposit is refunded in full to its original payment method within five working days. Inside 72 hours the deposit is retained; the balance is never charged. Yacht charters and flight-inclusive itineraries carry a 14-day window because of operator commitments, which we state again in writing before you pay.',
          ru: 'При отмене более чем за 72 часа до начала предоплата возвращается полностью тем же способом оплаты в течение пяти рабочих дней. Менее чем за 72 часа предоплата удерживается; остаток не списывается никогда. Для яхт-чартеров и программ с перелётом действует срок 14 дней из-за обязательств перед операторами, мы отдельно указываем это письменно до оплаты.',
          tr: 'Başlangıç saatinden 72 saatten fazla önce iptal ederseniz ön ödeme, beş iş günü içinde orijinal ödeme yöntemine tam olarak iade edilir. 72 saatin içinde ön ödeme iade edilmez; bakiye asla tahsil edilmez. Yat kiralamaları ve uçuş dâhil programlarda operatör taahhütleri nedeniyle 14 günlük bir pencere geçerlidir ve bunu ödemeden önce yazılı olarak ayrıca belirtiriz.',
        },
      },
      {
        h: { en: 'Cancellation by us', ru: 'Отмена с нашей стороны', tr: 'Bizim tarafımızdan iptal' },
        p: {
          en: 'If we cancel for any reason at all (weather, mechanical failure, a guide falling ill), you choose between a full refund processed the same day or a rescheduled date at the same price. We do not issue credit notes against future bookings.',
          ru: 'Если отменяем мы по любой причине, погода, техническая неисправность, болезнь гида, что угодно, вы выбираете между полным возвратом в тот же день и переносом на другую дату по той же цене. Мы не выдаём кредит-ноты в счёт будущих броней.',
          tr: 'Herhangi bir nedenle biz iptal edersek (hava, mekanik arıza, rehberin hastalanması), aynı gün işleme alınan tam iade ile aynı fiyattan yeni bir tarih arasında seçim yaparsınız. Gelecekteki rezervasyonlara mahsuben alacak belgesi düzenlemeyiz.',
        },
      },
      {
        h: { en: 'Things outside anyone’s control', ru: 'Обстоятельства вне чьего-либо контроля', tr: 'Kimsenin kontrolü dışındaki durumlar' },
        p: {
          en: 'Museum closures ordered at short notice, road closures for state visits, strikes, and civil aviation grounding balloon flights all happen in Istanbul. Where a site is shut we substitute something of equal standing and refund the difference in entrance fees. Where a whole component cannot run, that component is refunded.',
          ru: 'Внезапные закрытия музеев, перекрытия дорог из-за государственных визитов, забастовки и запрет полётов шаров гражданской авиацией, всё это в Стамбуле случается. Если объект закрыт, мы заменяем его равнозначным и возвращаем разницу по входным билетам. Если целый компонент невозможен, он возвращается.',
          tr: 'Kısa süre önce duyurulan müze kapanışları, devlet ziyaretleri için yol kapatmaları, grevler ve sivil havacılığın balon uçuşlarını durdurması İstanbul’da olur. Bir yer kapalıysa eş değerde bir alternatif koyar ve giriş ücreti farkını iade ederiz. Bir bileşen tümüyle yapılamıyorsa o bileşen iade edilir.',
        },
      },
      {
        h: { en: 'Conduct and safety', ru: 'Поведение и безопасность', tr: 'Davranış ve güvenlik' },
        p: {
          en: 'Our guides and captains may end a service without refund if a guest is intoxicated to the point of being unsafe, or behaves in a way that endangers others. This has happened twice in a decade and we would rather it stayed that way.',
          ru: 'Наши гиды и капитаны вправе прекратить обслуживание без возврата средств, если гость находится в состоянии опьянения, создающем опасность, или ведёт себя так, что угрожает окружающим. За десять лет это случалось дважды, и мы предпочли бы, чтобы так и осталось.',
          tr: 'Bir misafir güvenliği tehlikeye atacak ölçüde sarhoşsa veya başkalarını tehlikeye atacak şekilde davranıyorsa, rehberlerimiz ve kaptanlarımız hizmeti iade yapmadan sonlandırabilir. Bu on yılda iki kez oldu ve öyle kalmasını tercih ederiz.',
        },
      },
      {
        h: { en: 'Insurance and liability', ru: 'Страхование и ответственность', tr: 'Sigorta ve sorumluluk' },
        p: {
          en: 'We carry professional liability insurance as required of a licensed Turkish travel agency, and every vehicle and vessel we use is separately insured for passengers. This does not replace your own travel insurance, which you should hold, particularly for medical cover and for the balloon flight.',
          ru: 'У нас есть страхование профессиональной ответственности, обязательное для лицензированного турецкого турагентства, и каждый используемый автомобиль и судно застрахованы отдельно на пассажиров. Это не заменяет вашу личную туристическую страховку, которая должна у вас быть, особенно медицинскую и для полёта на шаре.',
          tr: 'Lisanslı bir Türk seyahat acentesinden istendiği üzere mesleki sorumluluk sigortamız vardır ve kullandığımız her araç ve tekne yolcular için ayrıca sigortalıdır. Bu, sizin kendi seyahat sigortanızın yerine geçmez; özellikle sağlık teminatı ve balon uçuşu için sahibi olmalısınız.',
        },
      },
    ]),
  },

  privacy: {
    slug: 'privacy',
    title: { en: 'Privacy', ru: 'Конфиденциальность', tr: 'Gizlilik' },
    updated: '2026-01-15',
    intro: {
      en: 'We collect the minimum needed to run your booking, and we do not sell anything to anyone.',
      ru: 'Мы собираем минимум, необходимый для организации вашей поездки, и ничего никому не продаём.',
      tr: 'Rezervasyonunuzu yürütmek için gereken asgariyi toplarız ve kimseye hiçbir şey satmayız.',
    },
    sections: sections([
      {
        h: { en: 'What we collect', ru: 'Какие данные мы собираем', tr: 'Neleri topluyoruz' },
        p: {
          en: 'Your name, contact details, travel dates, party size, and anything you tell us about dietary needs or mobility. If you pay by card, the payment is processed by our bank, we never see or store the card number.',
          ru: 'Имя, контактные данные, даты поездки, размер группы и всё, что вы сообщаете о питании или мобильности. При оплате картой платёж обрабатывает наш банк, мы не видим и не храним номер карты.',
          tr: 'Adınız, iletişim bilgileriniz, seyahat tarihleriniz, grup büyüklüğünüz ve beslenme ya da hareket kabiliyeti hakkında bize söyledikleriniz. Kartla öderseniz ödeme bankamız tarafından işlenir, kart numarasını hiç görmez ve saklamayız.',
        },
      },
      {
        h: { en: 'Why we hold it', ru: 'Зачем мы это храним', tr: 'Neden saklıyoruz' },
        p: {
          en: 'To deliver the service you booked and to meet Turkish accounting law, which requires invoice records to be kept for ten years. Health and dietary information is passed only to the guide, captain or restaurant who needs it, and deleted after your trip.',
          ru: 'Чтобы оказать забронированную услугу и выполнить требования турецкого бухгалтерского законодательства, обязывающего хранить счета десять лет. Сведения о здоровье и питании передаются только гиду, капитану или ресторану, которым они нужны, и удаляются после поездки.',
          tr: 'Rezerve ettiğiniz hizmeti sunmak ve fatura kayıtlarının on yıl saklanmasını zorunlu kılan Türk muhasebe mevzuatına uymak için. Sağlık ve beslenme bilgileri yalnızca ihtiyacı olan rehber, kaptan ya da restorana iletilir ve seyahatinizden sonra silinir.',
        },
      },
      {
        h: { en: 'Analytics', ru: 'Аналитика', tr: 'Analitik' },
        p: {
          en: 'This site loads Google Analytics only if you accept it in the banner. Decline and no analytics script is downloaded at all, not a blocked one, not an anonymised one. None. Nothing else on the site tracks you; there are no advertising pixels, no session recorders and no third-party fonts loaded from a tracking host.',
          ru: 'Сайт загружает Google Analytics только если вы согласитесь в баннере. При отказе аналитический скрипт не загружается вовсе, ни заблокированный, ни анонимизированный. Никакой. Больше вас ничто на сайте не отслеживает: нет рекламных пикселей, записи сессий и сторонних шрифтов с трекинговых хостов.',
          tr: 'Bu site Google Analytics’i yalnızca banner’da kabul ederseniz yükler. Reddederseniz hiçbir analitik betiği indirilmez, engellenmiş biri de, anonimleştirilmiş biri de değil. Hiçbiri. Sitede sizi izleyen başka bir şey yok; reklam pikseli, oturum kaydedici ve izleyici bir sunucudan yüklenen üçüncü taraf yazı tipi bulunmaz.',
        },
      },
      {
        h: { en: 'Your rights', ru: 'Ваши права', tr: 'Haklarınız' },
        p: {
          en: 'Under KVKK (Turkish law 6698) and GDPR where it applies, you can ask what we hold, correct it, or have it deleted subject to the accounting retention above. Email us and we will answer within thirty days, usually within two.',
          ru: 'Согласно KVKK (закон Турции 6698) и GDPR, где он применим, вы можете запросить, какие данные у нас есть, исправить их или потребовать удаления с учётом указанного срока бухгалтерского хранения. Напишите нам, ответим в течение тридцати дней, обычно в течение двух.',
          tr: 'KVKK (6698 sayılı Kanun) ve uygulandığı yerde GDPR kapsamında, hangi verileri tuttuğumuzu sorabilir, düzelttirebilir veya yukarıdaki muhasebe saklama süresi saklı kalmak kaydıyla sildirebilirsiniz. Bize e-posta gönderin; otuz gün içinde, genellikle iki gün içinde yanıtlarız.',
        },
      },
    ]),
  },
}

export const policyList = Object.values(policies)

export function getPolicy(slug) {
  return policies[slug]
}

export default policies
