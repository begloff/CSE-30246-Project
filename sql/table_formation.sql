CREATE TABLE nightly_stats(
   week_id int(11),
   day_of_week char(2),
   date datetime,
   total_revenue decimal(5,2),
   cash_revenue decimal(5,2),
   venmo_revenue decimal(5,2),
   online_fee decimal(5,2),
   num_orders int,
);