-- inHOMEuse marketplace schema
create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  role text not null default 'renter',
  phone text not null default '',
  bio text not null default '',
  city text not null default 'Almaty',
  verified boolean not null default false,
  trust_score integer not null default 42,
  language text not null default 'ru',
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id serial primary key,
  owner_id text not null,
  title text not null,
  description text not null,
  city text not null,
  district text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  rooms integer not null,
  area_m2 integer not null,
  floor integer not null default 1,
  floors_total integer not null default 9,
  price_kzt integer not null,
  deposit_kzt integer not null default 0,
  furnished boolean not null default true,
  pets_allowed boolean not null default false,
  kids_allowed boolean not null default true,
  photos text not null default '[]',
  amenities text not null default '[]',
  status text not null default 'published',
  available_from date,
  created_at timestamptz not null default now()
);
create index if not exists listings_city_idx on listings (city);
create index if not exists listings_owner_idx on listings (owner_id);
create index if not exists listings_status_idx on listings (status);

create table if not exists applications (
  id serial primary key,
  listing_id integer not null references listings(id) on delete cascade,
  renter_id text not null,
  landlord_id text not null,
  message text not null,
  start_date date not null,
  months integer not null default 12,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists applications_renter_idx on applications (renter_id);
create index if not exists applications_parties_idx on applications (renter_id, landlord_id);

create table if not exists conversations (
  id serial primary key,
  listing_id integer not null references listings(id) on delete cascade,
  renter_id text not null,
  landlord_id text not null,
  application_id integer,
  created_at timestamptz not null default now()
);
create unique index if not exists conversations_unique_idx on conversations (listing_id, renter_id);

create table if not exists messages (
  id serial primary key,
  conversation_id integer not null references conversations(id) on delete cascade,
  sender_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on messages (conversation_id, id);

create table if not exists payments (
  id serial primary key,
  application_id integer not null references applications(id) on delete cascade,
  payer_id text not null,
  payee_id text not null,
  amount_kzt integer not null,
  kind text not null,
  method text not null default 'kaspi',
  status text not null default 'pending',
  kaspi_ref text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists payments_payer_idx on payments (payer_id);
create index if not exists payments_payee_idx on payments (payee_id);

create table if not exists reviews (
  id serial primary key,
  listing_id integer not null references listings(id) on delete cascade,
  application_id integer not null,
  author_id text not null,
  target_id text not null,
  rating integer not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  user_id text not null,
  listing_id integer not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
