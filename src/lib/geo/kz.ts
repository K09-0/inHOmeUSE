export type LangName = { kk: string; ru: string; en: string };

export type District = LangName & {
  id: string;
  /** Older listing text that should still match this district. */
  aliases?: string[];
};

export type City = LangName & {
  id: string;
  region: string;
  lat: number;
  lng: number;
  districts: District[];
};

export type Region = LangName & { id: string };

const whole: District = {
  id: "city",
  kk: "Бүкіл қала",
  ru: "Весь город",
  en: "Whole city",
};

function d(id: string, kk: string, ru: string, en: string, aliases?: string[]): District {
  return { id, kk, ru, en, aliases };
}

export const REGIONS: Region[] = [
  { id: "almaty-city", kk: "Алматы қ.", ru: "г. Алматы", en: "Almaty city" },
  { id: "astana-city", kk: "Астана қ.", ru: "г. Астана", en: "Astana city" },
  { id: "shymkent-city", kk: "Шымкент қ.", ru: "г. Шымкент", en: "Shymkent city" },
  { id: "abai", kk: "Абай облысы", ru: "область Абай", en: "Abai Region" },
  { id: "akmola", kk: "Ақмола облысы", ru: "Акмолинская область", en: "Akmola Region" },
  { id: "aktobe", kk: "Ақтөбе облысы", ru: "Актюбинская область", en: "Aktobe Region" },
  { id: "almaty-reg", kk: "Алматы облысы", ru: "Алматинская область", en: "Almaty Region" },
  { id: "atyrau", kk: "Атырау облысы", ru: "Атырауская область", en: "Atyrau Region" },
  { id: "east", kk: "Шығыс Қазақстан", ru: "Восточно-Казахстанская область", en: "East Kazakhstan" },
  { id: "zhambyl", kk: "Жамбыл облысы", ru: "Жамбылская область", en: "Zhambyl Region" },
  { id: "zhetisu", kk: "Жетісу облысы", ru: "область Жетісу", en: "Jetisu Region" },
  { id: "west", kk: "Батыс Қазақстан", ru: "Западно-Казахстанская область", en: "West Kazakhstan" },
  { id: "karaganda", kk: "Қарағанды облысы", ru: "Карагандинская область", en: "Karaganda Region" },
  { id: "kostanay", kk: "Қостанай облысы", ru: "Костанайская область", en: "Kostanay Region" },
  { id: "kyzylorda", kk: "Қызылорда облысы", ru: "Кызылординская область", en: "Kyzylorda Region" },
  { id: "mangystau", kk: "Маңғыстау облысы", ru: "Мангистауская область", en: "Mangystau Region" },
  { id: "north", kk: "Солтүстік Қазақстан", ru: "Северо-Казахстанская область", en: "North Kazakhstan" },
  { id: "pavlodar", kk: "Павлодар облысы", ru: "Павлодарская область", en: "Pavlodar Region" },
  { id: "turkistan", kk: "Түркістан облысы", ru: "Туркестанская область", en: "Turkistan Region" },
  { id: "ulytau", kk: "Ұлытау облысы", ru: "область Ұлытау", en: "Ulytau Region" },
];

export const CITIES: City[] = [
  {
    id: "Almaty",
    region: "almaty-city",
    kk: "Алматы",
    ru: "Алматы",
    en: "Almaty",
    lat: 43.238,
    lng: 76.945,
    districts: [
      d("Almaly", "Алмалы", "Алмалинский", "Almaly"),
      d("Auezov", "Әуезов", "Ауэзовский", "Auezov"),
      d("Bostandyk", "Бостандық", "Бостандыкский", "Bostandyk", ["Бостандык"]),
      d("Medeu", "Медеу", "Медеуский", "Medeu", ["Медеу"]),
      d("Nauryzbay", "Наурызбай", "Наурызбайский", "Nauryzbay"),
      d("Turksib", "Түрксіб", "Турксибский", "Turksib"),
      d("Zhetysu", "Жетісу", "Жетысуский", "Zhetysu"),
      d("Alatau", "Алатау", "Алатауский", "Alatau"),
    ],
  },
  {
    id: "Astana",
    region: "astana-city",
    kk: "Астана",
    ru: "Астана",
    en: "Astana",
    lat: 51.128,
    lng: 71.43,
    districts: [
      d("Yesil", "Есіл", "Есиль", "Yesil"),
      d("Nura", "Нұра", "Нура", "Nura"),
      d("Saryarka", "Сарыарқа", "Сарыарка", "Saryarka"),
      d("Baykonyr", "Байқоңыр", "Байконыр", "Baykonyr"),
      d("Almaty-d", "Алматы", "Алматы", "Almaty"),
      d("Sarayshyk", "Сарайшық", "Сарайшык", "Sarayshyk"),
    ],
  },
  {
    id: "Shymkent",
    region: "shymkent-city",
    kk: "Шымкент",
    ru: "Шымкент",
    en: "Shymkent",
    lat: 42.32,
    lng: 69.59,
    districts: [
      d("Abai", "Абай", "Абайский", "Abai"),
      d("AlFarabi", "Әл-Фараби", "Аль-Фарабийский", "Al-Farabi"),
      d("Enbekshi", "Еңбекші", "Енбекшинский", "Enbekshi"),
      d("Karatau", "Қаратау", "Каратауский", "Karatau"),
      d("Turan", "Тұран", "Туранский", "Turan"),
    ],
  },
  city("Karaganda", "karaganda", "Қарағанды", "Караганда", "Karaganda", 49.806, 73.086, [
    d("Kazybekbi", "Қазыбек би", "им. Казыбек би", "Kazybek bi"),
    d("Bokeikhan", "Әлихан Бөкейхан", "Алихана Бокейхана", "Alikhan Bokeikhan"),
  ]),
  city("Temirtau", "karaganda", "Теміртау", "Темиртау", "Temirtau", 50.055, 72.964),
  city("Balkhash", "karaganda", "Балқаш", "Балхаш", "Balkhash", 46.848, 74.995),
  city("Saran", "karaganda", "Саран", "Сарань", "Saran", 49.791, 72.837),
  city("Shakhtinsk", "karaganda", "Шахтинск", "Шахтинск", "Shakhtinsk", 49.71, 72.587),
  city("Priozersk", "karaganda", "Приозерск", "Приозёрск", "Priozersk", 46.033, 73.7),
  city("Aktobe", "aktobe", "Ақтөбе", "Актобе", "Aktobe", 50.284, 57.167, [
    d("Aktobe-astana", "Астана", "Астана", "Astana"),
    d("Aktobe-almaty", "Алматы", "Алматы", "Almaty"),
  ]),
  city("Khromtau", "aktobe", "Хромтау", "Хромтау", "Khromtau", 50.251, 58.435),
  city("Kandyagash", "aktobe", "Қандыағаш", "Кандыагаш", "Kandyagash", 49.47, 57.418),
  city("Taraz", "zhambyl", "Тараз", "Тараз", "Taraz", 42.9, 71.367),
  city("Shu", "zhambyl", "Шу", "Шу", "Shu", 43.598, 73.761),
  city("Karatau", "zhambyl", "Қаратау", "Каратау", "Karatau", 43.167, 70.467),
  city("Zhanatas", "zhambyl", "Жаңатас", "Жанатас", "Zhanatas", 43.567, 69.734),
  city("Pavlodar", "pavlodar", "Павлодар", "Павлодар", "Pavlodar", 52.287, 76.967),
  city("Ekibastuz", "pavlodar", "Екібастұз", "Экибастуз", "Ekibastuz", 51.724, 75.323),
  city("Aksu", "pavlodar", "Ақсу", "Аксу", "Aksu", 52.04, 76.928),
  city("Oskemen", "east", "Өскемен", "Усть-Каменогорск", "Oskemen", 49.948, 82.628),
  city("Ridder", "east", "Риддер", "Риддер", "Ridder", 50.344, 83.513),
  city("Altay", "east", "Алтай", "Алтай", "Altay", 49.739, 84.272),
  city("Semey", "abai", "Семей", "Семей", "Semey", 50.411, 80.227),
  city("Kurchatov", "abai", "Курчатов", "Курчатов", "Kurchatov", 50.756, 78.541),
  city("Ayagoz", "abai", "Аягөз", "Аягоз", "Ayagoz", 47.965, 80.434),
  city("Atyrau", "atyrau", "Атырау", "Атырау", "Atyrau", 47.095, 51.924),
  city("Kostanay", "kostanay", "Қостанай", "Костанай", "Kostanay", 53.214, 63.625),
  city("Rudny", "kostanay", "Рудный", "Рудный", "Rudny", 52.973, 63.117),
  city("Lisakovsk", "kostanay", "Лисаковск", "Лисаковск", "Lisakovsk", 52.537, 62.494),
  city("Arkalyk", "kostanay", "Арқалық", "Аркалык", "Arkalyk", 50.249, 66.911),
  city("Kyzylorda", "kyzylorda", "Қызылорда", "Кызылорда", "Kyzylorda", 44.849, 65.482),
  city("Aral", "kyzylorda", "Арал", "Аральск", "Aral", 46.8, 61.667),
  city("Kazalinsk", "kyzylorda", "Қазалы", "Казалинск", "Kazalinsk", 45.762, 62.107),
  city("Baikonur", "kyzylorda", "Байқоңыр", "Байконур", "Baikonur", 45.623, 63.314),
  city("Oral", "west", "Орал", "Уральск", "Oral", 51.228, 51.387),
  city("Aksay", "west", "Ақсай", "Аксай", "Aksay", 51.168, 52.997),
  city("Petropavl", "north", "Петропавл", "Петропавловск", "Petropavl", 54.867, 69.143),
  city("Aktau", "mangystau", "Ақтау", "Актау", "Aktau", 43.652, 51.197),
  city("Zhanaozen", "mangystau", "Жаңаөзен", "Жанаозен", "Zhanaozen", 43.341, 52.862),
  city("Turkistan", "turkistan", "Түркістан", "Туркестан", "Turkistan", 43.297, 68.252),
  city("Kentau", "turkistan", "Кентау", "Кентау", "Kentau", 43.517, 68.51),
  city("Saryagash", "turkistan", "Сарыағаш", "Сарыагаш", "Saryagash", 41.459, 69.167),
  city("Zhetysai", "turkistan", "Жетісай", "Жетысай", "Zhetysai", 40.775, 68.327),
  city("Arys", "turkistan", "Арыс", "Арысь", "Arys", 42.43, 68.8),
  city("Lenger", "turkistan", "Леңгір", "Ленгер", "Lenger", 42.183, 69.884),
  city("Taldykorgan", "zhetisu", "Талдықорған", "Талдыкорган", "Taldykorgan", 45.016, 78.374),
  city("Zharkent", "zhetisu", "Жаркент", "Жаркент", "Zharkent", 44.162, 80.0),
  city("Kokshetau", "akmola", "Көкшетау", "Кокшетау", "Kokshetau", 53.283, 69.4),
  city("Stepnogorsk", "akmola", "Степногорск", "Степногорск", "Stepnogorsk", 52.35, 71.886),
  city("Shchuchinsk", "akmola", "Щучинск", "Щучинск", "Shchuchinsk", 52.936, 70.189),
  city("Konaev", "almaty-reg", "Қонаев", "Конаев", "Konaev", 43.854, 77.062),
  city("Alatau", "almaty-reg", "Алатау", "Алатау", "Alatau", 43.417, 77.05),
  city("Talgar", "almaty-reg", "Талғар", "Талгар", "Talgar", 43.303, 77.241),
  city("Kaskelen", "almaty-reg", "Қаскелең", "Каскелен", "Kaskelen", 43.202, 76.622),
  city("Esik", "almaty-reg", "Есік", "Есик", "Esik", 43.355, 77.452),
  city("Zhezkazgan", "ulytau", "Жезқазған", "Жезказган", "Zhezkazgan", 47.783, 67.767),
  city("Satpayev", "ulytau", "Сәтбаев", "Сатпаев", "Satpayev", 47.9, 67.533),
  city("Karazhal", "ulytau", "Қаражал", "Каражал", "Karazhal", 48.007, 70.79),
];

function city(
  id: string,
  region: string,
  kk: string,
  ru: string,
  en: string,
  lat: number,
  lng: number,
  districts: District[] = [whole],
): City {
  return { id, region, kk, ru, en, lat, lng, districts };
}

const byId = new Map(CITIES.map((c) => [c.id, c]));

export function findCity(id: string): City | undefined {
  return byId.get(id);
}

export function citiesIn(regionId: string): City[] {
  return CITIES.filter((c) => c.region === regionId);
}

export function findDistrict(city: City, districtId: string): District | undefined {
  return city.districts.find((item) => item.id === districtId);
}

export function placeName(lang: "kk" | "ru" | "en", item: LangName): string {
  return item[lang];
}

export function cityLabelFromGeo(lang: "kk" | "ru" | "en", cityId: string): string {
  const city = findCity(cityId);
  return city ? placeName(lang, city) : cityId;
}

export function districtLabel(lang: "kk" | "ru" | "en", cityId: string, districtId: string): string {
  const city = findCity(cityId);
  const district = city && findDistrict(city, districtId);
  return district ? placeName(lang, district) : districtId;
}

export function districtMatchValues(cityId: string, districtId: string): string[] {
  const city = findCity(cityId);
  const district = city && findDistrict(city, districtId);
  if (!district) return [districtId];
  return [...new Set([district.id, district.kk, district.ru, district.en, ...(district.aliases ?? [])])];
}
