alter table event_settings add column if not exists raffle_winner_id uuid;
alter table event_settings add column if not exists raffle_winner_name text;
