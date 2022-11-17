CREATE TABLE schedule(
   week_id int(11),
   day_of_week char(2),
   w1 char(20),
   w2 char(20),
   w3 char(20)
);

CREATE TABLE hours(
   week_id int(11),
   employee_id int(11),
   hours_worked decimal(3,2)
);

CREATE TABLE nightly_stats(
   week_id int(11),
   day_of_week char(2),
   date datetime,
   total_revenue decimal(5,2),
   cash_revenue decimal(5,2),
   venmo_revenue decimal(5,2),
   online_fee decimal(5,2),
   num_orders int,
   est_cost decimal(5,2),
   inv_used decimal(5,2),
   PRIMARY KEY(date)
);
