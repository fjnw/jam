-- Empty Data (need permission in User to drop tables... GRANT DROP ON )
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE prodImages;
TRUNCATE TABLE answers;
TRUNCATE TABLE questions;
TRUNCATE TABLE bids;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;