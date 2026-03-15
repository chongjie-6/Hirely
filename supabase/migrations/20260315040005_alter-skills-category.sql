create type skill_category as enum ('technical', 'soft');

alter table skills
  alter column category drop default,
  alter column category type skill_category using category::skill_category,
  alter column category set default 'technical';