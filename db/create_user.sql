create user 'jb_user'@'localhost' IDENTIFIED BY 'jb_1234';

GRANT UPDATE, DELETE, SELECT, INSERT, DROP ON jambid_db.* to 'jb_user'@'localhost';