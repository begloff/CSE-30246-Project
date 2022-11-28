-- CREATE TABLE nightly_stats(
--    week_id int(11),
--    day_of_week char(2),
--    date datetime,
--    total_revenue decimal(5,2),
--    cash_revenue decimal(5,2),
--    venmo_revenue decimal(5,2),
--    online_fee decimal(5,2),
--    num_orders int,
-- );

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
-- create a new table called inventory
CREATE TABLE inventory (
    week_id int(11),
    chicken int(11),
    cheese int(11),
    chips int(11),
    bacon int(11),
    PRIMARY KEY (week_id)
);

--insert into inventory
INSERT INTO inventory
VALUES (1, 10, 10, 10, 10);