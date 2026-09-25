import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "kk" | "ru" | "en";

const dict = {
  app: { kk: "inHOMEuse", ru: "inHOMEuse", en: "inHOMEuse" },
  tagline: {
    kk: "Пәтер кілті — бір қимыл. Кездесусіз.",
    ru: "Ключ от дома — в один жест. Без встреч.",
    en: "The key to home, in one gesture. No meetings.",
  },
  heroLead: {
    kk: "Қазақстандағы онлайн-жалға алу. Өтінім, чат, Kaspi төлемі және электронды шарт — бәрі қосымшада.",
    ru: "Онлайн-аренда в Казахстане. Заявка, чат, оплата Kaspi и электронный договор — всё внутри приложения.",
    en: "Online rentals in Kazakhstan. Apply, chat, pay with Kaspi, and sign digitally — all in the app.",
  },
  search: { kk: "Іздеу", ru: "Поиск", en: "Search" },
  home: { kk: "Басты", ru: "Главная", en: "Home" },
  chats: { kk: "Чаттар", ru: "Чаты", en: "Chats" },
  host: { kk: "Тапсыру", ru: "Сдать", en: "Host" },
  profile: { kk: "Профиль", ru: "Профиль", en: "Profile" },
  signIn: { kk: "Кіру", ru: "Войти", en: "Sign in" },
  signUp: { kk: "Тіркелу", ru: "Регистрация", en: "Create account" },
  signOut: { kk: "Шығу", ru: "Выйти", en: "Sign out" },
  continueGoogle: { kk: "Google арқылы", ru: "Продолжить с Google", en: "Continue with Google" },
  continueX: { kk: "X арқылы", ru: "Продолжить с X", en: "Continue with X" },
  orEmail: { kk: "немесе email", ru: "или email", en: "or email" },
  email: { kk: "Email", ru: "Email", en: "Email" },
  password: { kk: "Құпиясөз", ru: "Пароль", en: "Password" },
  name: { kk: "Аты", ru: "Имя", en: "Name" },
  city: { kk: "Қала", ru: "Город", en: "City" },
  rooms: { kk: "Бөлме", ru: "Комнаты", en: "Rooms" },
  price: { kk: "Бағасы", ru: "Цена", en: "Price" },
  from: { kk: "бастап", ru: "от", en: "from" },
  to: { kk: "дейін", ru: "до", en: "to" },
  furnished: { kk: "Жиһазбен", ru: "С мебелью", en: "Furnished" },
  pets: { kk: "Жануарлар", ru: "С животными", en: "Pets" },
  apply: { kk: "Өтінім жіберу", ru: "Отправить заявку", en: "Send application" },
  swipeKey: { kk: "Кілтті құлыпқа сырғытыңыз", ru: "Проведите ключ к замку", en: "Slide the key into the lock" },
  favorites: { kk: "Таңдаулы", ru: "Избранное", en: "Saved" },
  applications: { kk: "Өтінімдер", ru: "Заявки", en: "Applications" },
  payments: { kk: "Төлемдер", ru: "Платежи", en: "Payments" },
  month: { kk: "ай / ай", ru: "₸ / мес", en: "₸ / mo" },
  deposit: { kk: "Кепіл", ru: "Залог", en: "Deposit" },
  verified: { kk: "Расталған", ru: "Проверен", en: "Verified" },
  trust: { kk: "Сенім", ru: "Доверие", en: "Trust" },
  chat: { kk: "Чат", ru: "Чат", en: "Chat" },
  payKaspi: { kk: "Kaspi-мен төлеу", ru: "Оплатить Kaspi", en: "Pay with Kaspi" },
  newListing: { kk: "Жаңа хабарландыру", ru: "Новое объявление", en: "New listing" },
  myListings: { kk: "Менің пәтерлерім", ru: "Мои квартиры", en: "My listings" },
  publish: { kk: "Жариялау", ru: "Опубликовать", en: "Publish" },
  title: { kk: "Тақырып", ru: "Название", en: "Title" },
  description: { kk: "Сипаттама", ru: "Описание", en: "Description" },
  address: { kk: "Мекенжай", ru: "Адрес", en: "Address" },
  district: { kk: "Аудан", ru: "Район", en: "District" },
  area: { kk: "Ауданы, м²", ru: "Площадь, м²", en: "Area, m²" },
  floor: { kk: "Қабат", ru: "Этаж", en: "Floor" },
  save: { kk: "Сақтау", ru: "Сохранить", en: "Save" },
  renter: { kk: "Жалға алушы", ru: "Арендатор", en: "Renter" },
  landlord: { kk: "Иесі", ru: "Арендодатель", en: "Host" },
  pending: { kk: "Күтуде", ru: "На рассмотрении", en: "Pending" },
  accepted: { kk: "Қабылданды", ru: "Принята", en: "Accepted" },
  declined: { kk: "Қабылданбады", ru: "Отклонена", en: "Declined" },
  paid: { kk: "Төленді", ru: "Оплачено", en: "Paid" },
  emptyListings: {
    kk: "Бұл сүзгіге пәтер табылмады.",
    ru: "По этим фильтрам квартир нет.",
    en: "No homes match these filters.",
  },
  emptyChats: {
    kk: "Чаттар әлі жоқ. Өтінім жіберіңіз.",
    ru: "Чатов пока нет. Отправьте заявку.",
    en: "No chats yet. Send an application.",
  },
  emptyApps: {
    kk: "Өтінімдер жоқ.",
    ru: "Заявок пока нет.",
    en: "No applications yet.",
  },
  featured: { kk: "Таңдаулы үйлер", ru: "Избранные дома", en: "Featured homes" },
  how: { kk: "Қалай жұмыс істейді", ru: "Как это работает", en: "How it works" },
  step1: {
    kk: "Пәтерді таңдаңыз — карта мен сүзгілер бойынша.",
    ru: "Выберите квартиру — по карте и фильтрам.",
    en: "Pick a home on the map and filters.",
  },
  step2: {
    kk: "Кілтті сырғытып өтінім жіберіңіз. Чат бірден ашылады.",
    ru: "Проведите ключом — заявка уходит, чат открывается.",
    en: "Slide the key to apply. Chat opens instantly.",
  },
  step3: {
    kk: "Kaspi арқылы төлеңіз, шартқа қол қойыңыз, кодты алыңыз.",
    ru: "Оплатите в Kaspi, подпишите договор, получите код от замка.",
    en: "Pay in Kaspi, sign the contract, get the lock code.",
  },
  commandHint: { kk: "Іздеу немесе пәрмен", ru: "Поиск или команда", en: "Search or command" },
  allCities: { kk: "Барлық қалалар", ru: "Все города", en: "All cities" },
  anyRooms: { kk: "Кез келген", ru: "Любые", en: "Any" },
  map: { kk: "Карта", ru: "Карта", en: "Map" },
  list: { kk: "Тізім", ru: "Список", en: "List" },
  startDate: { kk: "Кіру күні", ru: "Дата заезда", en: "Move-in date" },
  months: { kk: "Ай саны", ru: "Срок, мес.", en: "Months" },
  motivation: { kk: "Неге сіз", ru: "Почему вы", en: "Why you" },
  accept: { kk: "Қабылдау", ru: "Принять", en: "Accept" },
  decline: { kk: "Бас тарту", ru: "Отклонить", en: "Decline" },
  contract: { kk: "Шарт", ru: "Договор", en: "Contract" },
  occupancy: { kk: "Бос күндер", ru: "Занятость", en: "Occupancy" },
  message: { kk: "Хабар", ru: "Сообщение", en: "Message" },
  send: { kk: "Жіберу", ru: "Отправить", en: "Send" },
  payDeposit: { kk: "Кепілді төлеу", ru: "Оплатить залог", en: "Pay deposit" },
  kaspiHint: {
    kk: "Kaspi Pay: QR немесе қосымшада растаңыз. Нақты merchant API кейін қосылады.",
    ru: "Kaspi Pay: подтвердите по QR. Боевой merchant API подключается после регистрации.",
    en: "Kaspi Pay: confirm via QR. Live merchant API connects after registration.",
  },
  iPaid: { kk: "Kaspi-де төледім", ru: "Я оплатил в Kaspi", en: "I paid in Kaspi" },
  reviews: { kk: "Пікірлер", ru: "Отзывы", en: "Reviews" },
  noMeetings: {
    kk: "Кездесусіз мәміле",
    ru: "Сделка без встречи",
    en: "Deal without a meeting",
  },
  browse: { kk: "Пәтерлерді көру", ru: "Смотреть квартиры", en: "Browse homes" },
  becomeHost: { kk: "Пәтерді тапсыру", ru: "Сдать квартиру", en: "List a home" },
  saved: { kk: "Сақталды", ru: "В избранном", en: "Saved" },
  role: { kk: "Рөл", ru: "Роль", en: "Role" },
  phone: { kk: "Телефон", ru: "Телефон", en: "Phone" },
  bio: { kk: "Өзі туралы", ru: "О себе", en: "About" },
  verify: { kk: "Құжатты растау", ru: "Подтвердить документы", en: "Verify documents" },
  verifiedDone: { kk: "Құжаттар тексерілді", ru: "Документы проверены", en: "Documents verified" },
  incoming: { kk: "Кіріс өтінімдер", ru: "Входящие заявки", en: "Incoming requests" },
  outgoing: { kk: "Менің өтінімдерім", ru: "Мои заявки", en: "My requests" },
  lockCode: { kk: "Есік коды", ru: "Код от двери", en: "Door code" },
  afterPay: {
    kk: "Төлемнен кейін smart-lock коды осында пайда болады.",
    ru: "После оплаты здесь появится код smart-lock.",
    en: "After payment the smart-lock code appears here.",
  },
  welcomeBack: { kk: "Қайта оралуыңызбен", ru: "С возвращением", en: "Welcome back" },
  createAccount: {
    kk: "inHOMEuse-ке кіріңіз",
    ru: "Войдите в inHOMEuse",
    en: "Enter inHOMEuse",
  },
  passwordHint: {
    kk: "Кемінде 8 таңба",
    ru: "Не менее 8 символов",
    en: "At least 8 characters",
  },
  errorGeneric: { kk: "Қате пайда болды", ru: "Что-то пошло не так", en: "Something went wrong" },
  amenity_wifi: { kk: "Wi-Fi", ru: "Wi-Fi", en: "Wi-Fi" },
  amenity_parking: { kk: "Тұрақ", ru: "Парковка", en: "Parking" },
  amenity_elevator: { kk: "Лифт", ru: "Лифт", en: "Elevator" },
  amenity_balcony: { kk: "Балкон", ru: "Балкон", en: "Balcony" },
  amenity_washer: { kk: "Кір жуғыш", ru: "Стиральная", en: "Washer" },
  amenity_ac: { kk: "Кондиционер", ru: "Кондиционер", en: "A/C" },
  amenity_concierge: { kk: "Консьерж", ru: "Консьерж", en: "Concierge" },
  amenity_kids: { kk: "Балалар", ru: "Для детей", en: "Kids" },
  amenity_pets: { kk: "Жануарлар", ru: "Животные", en: "Pets" },
  almaty: { kk: "Алматы", ru: "Алматы", en: "Almaty" },
  astana: { kk: "Астана", ru: "Астана", en: "Astana" },
  shymkent: { kk: "Шымкент", ru: "Шымкент", en: "Shymkent" },
  sort: { kk: "Сұрыптау", ru: "Сортировка", en: "Sort" },
  newest: { kk: "Жаңа", ru: "Новые", en: "Newest" },
  cheap: { kk: "Арзан", ru: "Дешевле", en: "Price" },
  trustSort: { kk: "Сенім", ru: "По доверию", en: "Trust" },
  writeReview: { kk: "Пікір қалдыру", ru: "Оставить отзыв", en: "Write a review" },
  submitReview: { kk: "Жіберу", ru: "Отправить", en: "Submit" },
  noReviews: { kk: "Пікірлер әлі жоқ", ru: "Отзывов пока нет", en: "No reviews yet" },
  guest: { kk: "Қонақ", ru: "Гость", en: "Guest" },
  loading: { kk: "Жүктелуде…", ru: "Загрузка…", en: "Loading…" },
  view: { kk: "Ашу", ru: "Открыть", en: "Open" },
  perMonth: { kk: "/ ай", ru: "/ мес", en: "/ mo" },
  kidsOk: { kk: "Балаларға болады", ru: "Можно с детьми", en: "Kids welcome" },
  photos: { kk: "Фото сілтемелері", ru: "Ссылки на фото", en: "Photo URLs" },
  photosHint: {
    kk: "Үтірмен бөлінген URL",
    ru: "URL через запятую",
    en: "Comma-separated URLs",
  },
  published: { kk: "Жарияланды", ru: "Опубликовано", en: "Published" },
  language: { kk: "Тіл", ru: "Язык", en: "Language" },
  kaspiTitle: { kk: "Kaspi Pay", ru: "Kaspi Pay", en: "Kaspi Pay" },
  amount: { kk: "Сома", ru: "Сумма", en: "Amount" },
  ref: { kk: "Анықтама", ru: "Ссылка", en: "Reference" },
  close: { kk: "Жабу", ru: "Закрыть", en: "Close" },
  onlineOnly: {
    kk: "Кездесу жоқ. Кілт — код. Ақша — Kaspi.",
    ru: "Без встреч. Ключ — код. Деньги — Kaspi.",
    en: "No meetups. Key is a code. Money is Kaspi.",
  },
  commandEmpty: { kk: "Ештеңе табылмады", ru: "Ничего не найдено", en: "Nothing found" },
  typeMessage: { kk: "Хабар жазыңыз…", ru: "Напишите сообщение…", en: "Write a message…" },
  you: { kk: "Сіз", ru: "Вы", en: "You" },
  hostReply: {
    kk: "Сәлеметсіз бе! Өтінімді көрдім, чатта жауап беремін. Кездесусіз рәсімдейміз.",
    ru: "Здравствуйте! Заявку вижу, отвечаю здесь. Оформим без встречи.",
    en: "Hello! I see the request — we will handle everything here, no meeting needed.",
  },
} as const;

export type MsgKey = keyof typeof dict;

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: "ru",
      setLang: (lang) => set({ lang }),
    }),
    { name: "inhomeuse-lang" },
  ),
);

export function t(lang: Lang, key: MsgKey): string {
  return dict[key][lang];
}

export function tMaybe(lang: Lang, key: string, fallback: string): string {
  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    return dict[key as MsgKey][lang];
  }
  return fallback;
}

export const LANGS: { id: Lang; label: string }[] = [
  { id: "kk", label: "ҚАЗ" },
  { id: "ru", label: "РУС" },
  { id: "en", label: "ENG" },
];

export function cityLabel(lang: Lang, city: string): string {
  const key = city.toLowerCase();
  if (key === "almaty") return t(lang, "almaty");
  if (key === "astana") return t(lang, "astana");
  if (key === "shymkent") return t(lang, "shymkent");
  return city;
}
