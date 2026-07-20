-- 002 · page content: services (ONE pricing schema), portfolio blocks (6 types), presets

-- ---------- services — the one pricing schema (CLAUDE.md §0) ----------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  title_ar text not null default '',
  price numeric(12,2) not null,
  currency text not null default 'USD' check (currency in ('USD','LBP')),
  unit text not null check (unit in ('project','session','hour','event','day','month')),
  starting_from boolean not null default false,   -- "$600+"
  package_qty integer,                            -- e.g. 10-session pack
  note text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_profile_idx on public.services (profile_id, sort_order);
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;
create policy "services_owner_all" on public.services
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- portfolio blocks — block system, 6 v1 types (CLAUDE.md §0) ----------
create table public.portfolio_blocks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in
    ('image_grid','before_after','stat_card','video_link','case_card','testimonial')),
  position integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  -- image_grid:   { images: [{url, alt}] }
  -- before_after: { before: {url}, after: {url}, caption }
  -- stat_card:    { value, label, label_ar }            -- tutors/trainers/SMM hero
  -- video_link:   { url, provider, title }              -- link embed, no uploads in v1
  -- case_card:    { title, excerpt }                    -- writers; PDF parked v1.1
  -- testimonial:  { text, attribution, date_label }     -- rendered WhatsApp-style
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index portfolio_blocks_profile_idx on public.portfolio_blocks (profile_id, position);
create trigger portfolio_blocks_updated_at before update on public.portfolio_blocks
  for each row execute function public.set_updated_at();

alter table public.portfolio_blocks enable row level security;
create policy "blocks_owner_all" on public.portfolio_blocks
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- presets — a trade = a JSON config, never new code (CLAUDE.md §0) ----------
create table public.presets (
  key text primary key,
  label text not null,
  label_ar text not null default '',
  accent_color text not null,
  config jsonb not null
  -- config: { block_order: [type,...], default_unit, sample_services: [{title,title_ar,price,unit,starting_from}], copy: {tagline_en, tagline_ar} }
);
alter table public.presets enable row level security;
create policy "presets_public_read" on public.presets for select using (true);

insert into public.presets (key, label, label_ar, accent_color, config) values
('photographer','Photographer','مصوّر','#c9a45c', '{
  "block_order": ["image_grid","before_after","testimonial"],
  "default_unit": "event",
  "sample_services": [
    {"title":"Full wedding coverage","title_ar":"تغطية عرس كاملة","price":600,"unit":"event","starting_from":true},
    {"title":"Engagement session","title_ar":"جلسة خطوبة","price":150,"unit":"session","starting_from":false},
    {"title":"Events","title_ar":"مناسبات","price":250,"unit":"event","starting_from":false}
  ],
  "copy": {"tagline_en":"Wedding & Events Photographer","tagline_ar":"مصوّر أعراس ومناسبات"}
}'::jsonb),
('makeup_artist','Makeup Artist','خبيرة تجميل','#e08bb1', '{
  "block_order": ["before_after","image_grid","testimonial"],
  "default_unit": "session",
  "sample_services": [
    {"title":"Bridal makeup","title_ar":"مكياج عروس","price":200,"unit":"session","starting_from":true},
    {"title":"Event makeup","title_ar":"مكياج مناسبات","price":80,"unit":"session","starting_from":false}
  ],
  "copy": {"tagline_en":"Makeup Artist","tagline_ar":"خبيرة تجميل"}
}'::jsonb),
('tutor','Tutor','أستاذ خصوصي','#7fb4e8', '{
  "block_order": ["stat_card","testimonial","case_card"],
  "default_unit": "session",
  "sample_services": [
    {"title":"Private session","title_ar":"جلسة خصوصية","price":20,"unit":"hour","starting_from":false},
    {"title":"Monthly package","title_ar":"باقة شهرية","price":150,"unit":"month","starting_from":false,"package_qty":8}
  ],
  "copy": {"tagline_en":"Private Tutor","tagline_ar":"أستاذ خصوصي"}
}'::jsonb),
('designer','Designer','مصمّم','#8fd4a8', '{
  "block_order": ["image_grid","case_card","testimonial"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Logo & identity","title_ar":"شعار وهوية","price":150,"unit":"project","starting_from":true},
    {"title":"Social media pack","title_ar":"باقة سوشال ميديا","price":100,"unit":"month","starting_from":false}
  ],
  "copy": {"tagline_en":"Graphic Designer","tagline_ar":"مصمّم غرافيك"}
}'::jsonb),
('trainer','Trainer','مدرّب','#e8a87f', '{
  "block_order": ["before_after","stat_card","testimonial"],
  "default_unit": "month",
  "sample_services": [
    {"title":"Personal training","title_ar":"تدريب شخصي","price":25,"unit":"session","starting_from":false},
    {"title":"Monthly program","title_ar":"برنامج شهري","price":120,"unit":"month","starting_from":false}
  ],
  "copy": {"tagline_en":"Personal Trainer","tagline_ar":"مدرّب شخصي"}
}'::jsonb);
