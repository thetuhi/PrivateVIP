// FAQ content. Rendered by the accordion on /faq and emitted as FAQPage
// structured data, so keep answers factual and self-contained.

export const faqGroups = [
  {
    id: 'booking',
    title: { en: 'Booking & payment', ru: 'Бронирование и оплата', tr: 'Rezervasyon ve ödeme' },
    items: [
      {
        id: 'how-to-book',
        q: {
          en: 'How do I book?',
          ru: 'Как забронировать?',
          tr: 'Nasıl rezervasyon yapabilirim?',
        },
        a: {
          en: 'Send us your dates through the enquiry form or on WhatsApp. We reply within a few hours with a written itinerary and everything it involves, set out in full. Nothing is charged until you have read it and said yes.',
          ru: 'Отправьте даты через форму или в WhatsApp. Мы ответим в течение нескольких часов письменной программой, где расписано всё, что в неё входит. Никаких списаний до вашего согласия.',
          tr: 'Tarihlerinizi form üzerinden veya WhatsApp’tan gönderin. Birkaç saat içinde yazılı bir programla ve neleri kapsadığının tamamıyla döneriz. Siz okuyup onaylamadan hiçbir tahsilat yapılmaz.',
        },
      },
      {
        id: 'deposit',
        q: {
          en: 'How much deposit do you take?',
          ru: 'Какой размер предоплаты?',
          tr: 'Ne kadar ön ödeme alıyorsunuz?',
        },
        a: {
          en: '30% to confirm the date, the balance on the day. Yacht charters and Cappadocia flights need 50% because we pay operators in advance. We accept card, bank transfer and cash in EUR, USD or TRY.',
          ru: '30% для подтверждения даты, остаток, в день программы. Для яхт-чартеров и перелётов в Каппадокию, 50%, поскольку мы оплачиваем операторов заранее. Принимаем карты, банковский перевод и наличные в EUR, USD или TRY.',
          tr: 'Tarihi kesinleştirmek için %30, kalanı gün içinde. Yat kiralamaları ve Kapadokya uçuşları için %50, çünkü operatörlere peşin ödüyoruz. Kart, havale ve EUR, USD veya TRY nakit kabul ediyoruz.',
        },
      },
    ],
  },
  {
    id: 'changes',
    title: { en: 'Changes & cancellation', ru: 'Изменения и отмена', tr: 'Değişiklik ve iptal' },
    items: [
      {
        id: 'cancel',
        q: {
          en: 'What if I need to cancel?',
          ru: 'Что если мне нужно отменить?',
          tr: 'İptal etmem gerekirse ne olur?',
        },
        a: {
          en: 'Free cancellation up to 72 hours before the start, with the deposit returned in full to the card it came from. Inside 72 hours the deposit is retained. If we cancel for weather, illness or anything else on our side, you get everything back the same day.',
          ru: 'Бесплатная отмена не позднее чем за 72 часа до начала; предоплата возвращается полностью на ту же карту. Менее чем за 72 часа предоплата удерживается. Если отменяем мы, погода, болезнь, любая причина с нашей стороны, вы получаете всё обратно в тот же день.',
          tr: 'Başlangıçtan 72 saat öncesine kadar ücretsiz iptal; ön ödeme geldiği karta tam olarak iade edilir. 72 saatin içinde ön ödeme iade edilmez. Hava, hastalık ya da bizim tarafımızdaki herhangi bir nedenle iptal eden biz olursak, her şeyi aynı gün geri alırsınız.',
        },
      },
      {
        id: 'weather',
        q: {
          en: 'What happens if the weather is bad?',
          ru: 'Что будет при плохой погоде?',
          tr: 'Hava kötü olursa ne olur?',
        },
        a: {
          en: 'City tours run in rain. The interiors are the best part anyway and the car is never far. Boat charters and balloon flights are different: if the operator will not sail or fly, we move you to another day or refund that portion in full. We will always tell you the day before rather than let you find out at the jetty.',
          ru: 'Городские экскурсии проводятся и в дождь, интерьеры всё равно самое интересное, а машина всегда рядом. С яхтами и полётами на шаре иначе: если оператор не выходит, мы переносим день или возвращаем эту часть полностью. Мы всегда сообщаем накануне, а не оставляем вас выяснять это на причале.',
          tr: 'Şehir turları yağmurda da yapılır. Zaten en güzel kısmı iç mekânlar ve araç hiç uzakta değil. Tekne ve balon farklıdır: operatör çıkmıyorsa sizi başka bir güne alır ya da o bölümü tam iade ederiz. Bunu iskelede öğrenmenize bırakmaz, her zaman bir gün önce söyleriz.',
        },
      },
      {
        id: 'customise',
        q: {
          en: 'Can we change the itinerary on the day?',
          ru: 'Можно ли изменить маршрут в день экскурсии?',
          tr: 'Programı gün içinde değiştirebilir miyiz?',
        },
        a: {
          en: 'Yes, and it happens on most tours. If you want to spend two hours in one museum instead of forty minutes each in three, say so and your guide will rebuild the afternoon. The only fixed points are timed entrance tickets and restaurant reservations, and even those can usually be moved.',
          ru: 'Да, и так происходит на большинстве туров. Хотите провести два часа в одном музее вместо сорока минут в трёх, скажите, и гид перестроит вторую половину дня. Фиксированы только билеты на конкретное время и брони в ресторанах, но и их обычно можно сдвинуть.',
          tr: 'Evet, çoğu turda olur. Üç müzede kırkar dakika yerine bir müzede iki saat geçirmek isterseniz söyleyin, rehberiniz öğleden sonrayı yeniden kurar. Tek sabit noktalar saatli giriş biletleri ve restoran rezervasyonlarıdır; onlar bile genellikle kaydırılabilir.',
        },
      },
    ],
  },
  {
    id: 'practical',
    title: { en: 'On the day', ru: 'В день программы', tr: 'Gün içinde' },
    items: [
      {
        id: 'languages',
        q: {
          en: 'What languages do your guides speak?',
          ru: 'На каких языках говорят гиды?',
          tr: 'Rehberleriniz hangi dilleri konuşuyor?',
        },
        a: {
          en: 'English, Russian and Turkish as standard. Arabic, German, French, Spanish and Italian with advance notice. All our guides hold a Ministry of Culture and Tourism licence. That is a legal requirement inside museums, and a lot of operators quietly ignore it.',
          ru: 'Английский, русский и турецкий, всегда. Арабский, немецкий, французский, испанский и итальянский, при предварительном уведомлении. Все наши гиды имеют лицензию Министерства культуры и туризма: это обязательное требование в музеях, которое многие операторы тихо игнорируют.',
          tr: 'Standart olarak İngilizce, Rusça ve Türkçe. Önceden haber verilirse Arapça, Almanca, Fransızca, İspanyolca ve İtalyanca. Tüm rehberlerimiz Kültür ve Turizm Bakanlığı ruhsatlıdır. Müze içinde bu yasal bir zorunluluktur ve birçok operatör bunu sessizce görmezden gelir.',
        },
      },
      {
        id: 'accessibility',
        q: {
          en: 'Can you accommodate limited mobility?',
          ru: 'Возможна ли программа при ограниченной мобильности?',
          tr: 'Kısıtlı hareket kabiliyetine uygun mu?',
        },
        a: {
          en: 'Often, yes. Hagia Sophia, Topkapı’s main courtyards and the Bosphorus itineraries are all workable with a wheelchair; the Basilica Cistern and Balat are not. Tell us the specifics and we will tell you honestly what works rather than promising and improvising on the day.',
          ru: 'Часто да. Айя-София, основные дворы Топкапы и босфорские маршруты доступны для коляски; Цистерна Базилика и Балат, нет. Опишите ситуацию, и мы честно скажем, что подойдёт, вместо обещаний и импровизации на месте.',
          tr: 'Çoğu zaman evet. Ayasofya, Topkapı’nın ana avluları ve Boğaz programları tekerlekli sandalyeyle mümkündür; Yerebatan Sarnıcı ve Balat değildir. Ayrıntıları bize iletin; söz verip gün içinde doğaçlama yapmak yerine neyin işe yarayacağını dürüstçe söyleyelim.',
        },
      },
      {
        id: 'children',
        q: {
          en: 'Are children welcome?',
          ru: 'Можно ли с детьми?',
          tr: 'Çocuklar katılabilir mi?',
        },
        a: {
          en: 'Yes, and the private format suits them far better than a group. Child seats are fitted free, guides shorten the standing-and-listening sections, and we will happily build a day around a boat, a cat-heavy neighbourhood and an ice cream instead of three museums.',
          ru: 'Да, и частный формат подходит им гораздо лучше группового. Детские кресла устанавливаем бесплатно, гиды сокращают части «стоим и слушаем», и мы с радостью построим день вокруг катера, квартала с кошками и мороженого вместо трёх музеев.',
          tr: 'Evet ve özel format onlara gruptan çok daha uygundur. Çocuk koltukları ücretsiz takılır, rehberler ayakta dinleme bölümlerini kısaltır ve günü üç müze yerine bir tekne, kedi dolu bir mahalle ve dondurma etrafında kurmaktan memnuniyet duyarız.',
        },
      },
      {
        id: 'tipping',
        q: {
          en: 'Should we tip?',
          ru: 'Нужно ли давать чаевые?',
          tr: 'Bahşiş vermeli miyiz?',
        },
        a: {
          en: 'Only if you want to. Our guides and drivers are paid properly and are never told what a client gave. If you would like to, roughly a tenth of the day, split between guide and driver, is generous by local standards.',
          ru: 'Только по желанию. Наши гиды и водители получают достойную оплату и никогда не узнают, кто сколько оставил. Если хотите, примерно десятая часть дня, разделённая между гидом и водителем, по местным меркам щедро.',
          tr: 'Yalnızca istersen. Rehber ve şoförlerimiz düzgün ödeme alır ve bir misafirin ne verdiği kendilerine asla söylenmez. Vermek isterseniz, günün kabaca onda birini rehber ve şoför arasında paylaştırmak yerel ölçüde cömerttir.',
        },
      },
    ],
  },
]

export default faqGroups
