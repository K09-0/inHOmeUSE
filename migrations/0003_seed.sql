insert into listings (
  owner_id, title, description, city, district, address, lat, lng,
  rooms, area_m2, floor, floors_total, price_kzt, deposit_kzt,
  furnished, pets_allowed, kids_allowed, photos, amenities, status, available_from
) values
(
  'seed-medeu',
  'Светлая двушка с видом на Медеу',
  'Онлайн-аренда без встреч. Квартира после ремонта, панорамные окна на горы, тихий двор. Ключ передаём через проверенный бокс у консьержа. Договор и залог — в приложении.',
  'Almaty', 'Медеу', 'ул. Керей-Жәнібек хандар 15', 43.2176, 76.9754,
  2, 68, 8, 12, 280000, 280000, true, false, true,
  '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","parking","elevator","balcony","washer","ac"]',
  'published', '2026-09-01'
),
(
  'seed-samal',
  'Студия у Достык Plaza',
  'Компактная студия для одного. Мебель IKEA, рабочий стол, быстрый интернет. Заезд по электронному коду. Коммуналка включена в цену.',
  'Almaty', 'Самал', 'пр. Достык 104', 43.2331, 76.9572,
  1, 32, 5, 9, 180000, 90000, true, false, false,
  '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","elevator","washer","ac"]',
  'published', '2026-08-28'
),
(
  'seed-bostandyk',
  'Семейная трёшка в Ботаническом',
  'Три комнаты, два санузла, детская уже собрана. Можно с детьми. Рядом Ботанический сад и школы. Видео-тур и электронный договор внутри inHOMEuse.',
  'Almaty', 'Бостандык', 'ул. Аль-Фараби 112', 43.2074, 76.9008,
  3, 96, 4, 7, 420000, 420000, true, true, true,
  '["https://images.unsplash.com/photo-1600585154340-0ef3ee1ead48?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","parking","elevator","balcony","washer","ac","kids"]',
  'published', '2026-09-10'
),
(
  'seed-almaly',
  'Однушка в центре, Алмалы',
  'Исторический центр, 7 минут пешком до Арбата. После косметики, новая техника. Идеально для командировок. Оплата через Kaspi.',
  'Almaty', 'Алмалы', 'ул. Панфилова 98', 43.2565, 76.9440,
  1, 41, 3, 5, 150000, 150000, true, false, true,
  '["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","washer","balcony"]',
  'published', '2026-08-26'
),
(
  'seed-orbita',
  'Двушка на Орбите с парковкой',
  'Тихий район, закрытый двор, машиноместо. Хозяин на связи в чате 24/7. Счётчики передаём фото в приложении — без визитов.',
  'Almaty', 'Орбита', 'мкр Орбита-3, 12', 43.1988, 76.8775,
  2, 58, 6, 9, 200000, 200000, true, true, true,
  '["https://images.unsplash.com/photo-1505693416388-bb6ce8a008e7?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","parking","elevator","washer","pets"]',
  'published', '2026-09-05'
),
(
  'seed-esil',
  'Апартаменты на Левом берегу',
  'Новый ЖК у набережной Есиля. Охрана, коворкинг в лобби. Ключ в smart-lock, код приходит после оплаты залога в Kaspi.',
  'Astana', 'Есиль', 'ул. Дінмұхамед Қонаев 12', 51.1282, 71.4305,
  2, 64, 11, 18, 250000, 250000, true, false, true,
  '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600585154340-0ef3ee1ead48?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","parking","elevator","ac","concierge"]',
  'published', '2026-09-01'
),
(
  'seed-nurzhol',
  'Трёшка у Байтерека',
  'Видовая квартира на Нуржол бульваре. Для семьи или команды. Полностью меблирована, посуда, текстиль. Договор генерируется автоматически.',
  'Astana', 'Нуржол', 'бул. Нуржол 29', 51.1289, 71.4306,
  3, 110, 14, 22, 390000, 390000, true, false, true,
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","parking","elevator","balcony","washer","ac","concierge"]',
  'published', '2026-09-15'
),
(
  'seed-shymkent',
  'Уютная двушка в Шымкенте',
  'Район Абая, рядом базар и школа. Честная цена, прозрачные платежи. Все вопросы — только в чате inHOMEuse.',
  'Shymkent', 'Абай', 'пр. Республики 44', 42.3419, 69.5901,
  2, 54, 2, 5, 120000, 120000, true, true, true,
  '["https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80"]',
  '["wifi","balcony","washer","pets"]',
  'published', '2026-08-30'
);

insert into profiles (user_id, display_name, role, city, verified, trust_score, bio)
values
  ('seed-medeu', 'Айгерим К.', 'landlord', 'Almaty', true, 96, 'Сдаю 4 квартиры. Все сделки только онлайн.'),
  ('seed-samal', 'Данияр Т.', 'landlord', 'Almaty', true, 88, 'IT-специалист, отвечаю в чате быстро.'),
  ('seed-bostandyk', 'Мария Л.', 'landlord', 'Almaty', true, 91, 'Семейные квартиры, можно с детьми.'),
  ('seed-almaly', 'Ерлан С.', 'landlord', 'Almaty', false, 71, 'Центр города, короткие сроки тоже рассматриваю.'),
  ('seed-orbita', 'Сауле Н.', 'landlord', 'Almaty', true, 84, 'Орбита, тихий двор.'),
  ('seed-esil', 'Arman B.', 'landlord', 'Astana', true, 93, 'Новые ЖК Левого берега.'),
  ('seed-nurzhol', 'Камила Ж.', 'landlord', 'Astana', true, 90, 'Видовые апартаменты.'),
  ('seed-shymkent', 'Нурлан А.', 'landlord', 'Shymkent', true, 80, 'Честные условия, без скрытых платежей.');
