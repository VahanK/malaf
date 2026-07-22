-- 028 · Fill out the trade presets. The first batches missed several of the
-- most common Lebanese freelancer types — notably DEVELOPER (a signup had to
-- pick "Designer" for lack of a dev option), plus writer, videographer,
-- marketer, translator, photographer-adjacent. Pure data: a preset = JSON
-- config (block order + starter services + dialect copy), zero new code
-- (CLAUDE.md §0). Credibility-block orders for advisory/non-visual trades;
-- image-heavy orders for those whose work is photographable.
insert into public.presets (key, label, label_ar, accent_color, config) values
('developer','Developer','مطوّر برمجيات','#4f7cff', '{
  "block_order": ["case_card","stat_card","testimonial"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Landing page / small site","title_ar":"صفحة هبوط / موقع صغير","price":400,"unit":"project","starting_from":true},
    {"title":"Web app build","title_ar":"تطبيق ويب","price":2000,"unit":"project","starting_from":true},
    {"title":"Hourly / retainer","title_ar":"بالساعة / عقد شهري","price":40,"unit":"hour","starting_from":false}
  ],
  "copy": {"tagline_en":"Software Developer","tagline_ar":"مطوّر برمجيات"}
}'::jsonb),
('writer','Writer','كاتب محتوى','#c77dff', '{
  "block_order": ["case_card","testimonial","stat_card"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Article / blog post","title_ar":"مقال / تدوينة","price":80,"unit":"project","starting_from":true},
    {"title":"Website copy","title_ar":"نصوص موقع","price":300,"unit":"project","starting_from":true},
    {"title":"Monthly content package","title_ar":"باقة محتوى شهرية","price":500,"unit":"month","starting_from":false}
  ],
  "copy": {"tagline_en":"Writer & Copywriter","tagline_ar":"كاتب محتوى ونصوص"}
}'::jsonb),
('videographer','Videographer','مصوّر فيديو','#ff6b6b', '{
  "block_order": ["video_link","image_grid","testimonial"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Event / wedding film","title_ar":"فيلم مناسبة / عرس","price":600,"unit":"event","starting_from":true},
    {"title":"Reel / short-form edit","title_ar":"مونتاج ريلز","price":120,"unit":"project","starting_from":false},
    {"title":"Product / brand video","title_ar":"فيديو منتج / علامة","price":400,"unit":"project","starting_from":true}
  ],
  "copy": {"tagline_en":"Videographer & Editor","tagline_ar":"مصوّر ومونتير فيديو"}
}'::jsonb),
('marketer','Marketer','خبير تسويق','#ff9f43', '{
  "block_order": ["stat_card","case_card","testimonial"],
  "default_unit": "month",
  "sample_services": [
    {"title":"Social media management","title_ar":"إدارة سوشال ميديا","price":350,"unit":"month","starting_from":true},
    {"title":"Ad campaign setup","title_ar":"إعداد حملة إعلانية","price":250,"unit":"project","starting_from":true},
    {"title":"Strategy session","title_ar":"جلسة استراتيجية","price":100,"unit":"hour","starting_from":false}
  ],
  "copy": {"tagline_en":"Marketing & Social Media","tagline_ar":"تسويق وسوشال ميديا"}
}'::jsonb),
('translator','Translator','مترجم','#54a0ff', '{
  "block_order": ["stat_card","testimonial","case_card"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Document translation","title_ar":"ترجمة مستندات","price":0.08,"unit":"project","starting_from":true},
    {"title":"Certified / legal translation","title_ar":"ترجمة قانونية معتمدة","price":50,"unit":"project","starting_from":true}
  ],
  "copy": {"tagline_en":"Translator","tagline_ar":"مترجم"}
}'::jsonb)
on conflict (key) do nothing;
