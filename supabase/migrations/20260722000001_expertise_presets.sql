-- 027 · five more presets — consultant, coach, architect, lawyer, event
-- planner (Jul 22, docs/parking-lot.md item 1: "more presets" accepted,
-- free under the existing architecture — new preset = JSON config, zero
-- new code, CLAUDE.md §0). Block orders lean on credibility blocks
-- (case_card/stat_card/testimonial) for advisory trades that don't have a
-- visual body of work the way photographers/MUAs do; event planners get
-- the visual-heavy order since their work IS photographable.
insert into public.presets (key, label, label_ar, accent_color, config) values
('consultant','Consultant','مستشار','#9b8cd6', '{
  "block_order": ["stat_card","case_card","testimonial"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Strategy session","title_ar":"جلسة استراتيجية","price":150,"unit":"hour","starting_from":false},
    {"title":"Full engagement","title_ar":"مشروع كامل","price":1500,"unit":"project","starting_from":true}
  ],
  "copy": {"tagline_en":"Business Consultant","tagline_ar":"مستشار أعمال"}
}'::jsonb),
('coach','Coach','مدرّب حياة','#6fc3b8', '{
  "block_order": ["testimonial","stat_card","case_card"],
  "default_unit": "session",
  "sample_services": [
    {"title":"1:1 coaching session","title_ar":"جلسة فردية","price":60,"unit":"session","starting_from":false},
    {"title":"Monthly coaching package","title_ar":"باقة شهرية","price":400,"unit":"month","starting_from":false,"package_qty":4}
  ],
  "copy": {"tagline_en":"Life & Career Coach","tagline_ar":"مدرّب حياة ومسار مهني"}
}'::jsonb),
('architect','Architect','مهندس معماري','#b08a5c', '{
  "block_order": ["image_grid","case_card","testimonial"],
  "default_unit": "project",
  "sample_services": [
    {"title":"Consultation & site visit","title_ar":"استشارة وزيارة موقع","price":100,"unit":"hour","starting_from":false},
    {"title":"Full design & drawings","title_ar":"تصميم كامل ومخططات","price":3000,"unit":"project","starting_from":true}
  ],
  "copy": {"tagline_en":"Architect","tagline_ar":"مهندس معماري"}
}'::jsonb),
('lawyer','Lawyer','محامٍ','#5c7a99', '{
  "block_order": ["stat_card","testimonial","case_card"],
  "default_unit": "hour",
  "sample_services": [
    {"title":"Consultation","title_ar":"استشارة قانونية","price":80,"unit":"hour","starting_from":false},
    {"title":"Contract drafting & review","title_ar":"صياغة ومراجعة عقود","price":250,"unit":"project","starting_from":true}
  ],
  "copy": {"tagline_en":"Lawyer","tagline_ar":"محامٍ"}
}'::jsonb),
('event_planner','Event Planner','منظم مناسبات','#d68fa0', '{
  "block_order": ["image_grid","stat_card","testimonial"],
  "default_unit": "event",
  "sample_services": [
    {"title":"Day-of coordination","title_ar":"تنسيق يوم المناسبة","price":400,"unit":"event","starting_from":true},
    {"title":"Full planning package","title_ar":"باقة تنظيم كاملة","price":1800,"unit":"event","starting_from":true}
  ],
  "copy": {"tagline_en":"Event Planner","tagline_ar":"منظم مناسبات"}
}'::jsonb)
on conflict (key) do nothing;
