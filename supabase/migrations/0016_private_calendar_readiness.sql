-- B7 records calendar integration readiness without enabling it.
alter table hatmam_release_gates add column if not exists calendar_ready boolean not null default false;
comment on column hatmam_release_gates.calendar_ready is 'True only after private Cal.com embed/token flow is integration-verified. Default false.';
