CREATE TABLE users (
    id BIGINT unsigned auto_increment primary key,
    userName VARCHAR (25) UNIQUE NOT NULL,
    firstName VARCHAR (25) NOT NULL,
    lastName VARCHAR (25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(41) NOT NULL COLLATE utf8_bin,
    image VARCHAR(500) null,
    imageType varchar(4) null,
    createTs TIMESTAMP NOT NULL default current_timestamp,
    updateTs TIMESTAMP NOT NULL default current_timestamp
);

CREATE TABLE products (
   id bigint unsigned auto_increment primary key,
   prodName varchar(255) not null,
   category varchar(255) not null,
   description varchar(1000),
   returnPolicy varchar(1000),
   startingPrice decimal(20, 5) not null,
   location varchar(255),
   endTimestamp timestamp not null,
   sellerId bigint unsigned not null,
   createTs TIMESTAMP NOT NULL default current_timestamp,
   updateTs TIMESTAMP NOT NULL default current_timestamp,
   foreign key prod_user_id_fk (sellerId) references users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE bids (
   id BIGINT UNSIGNED AUTO_INCREMENT primary key,
   amount decimal(20, 2) NOT NULL,
   buyerId BIGINT UNSIGNED NOT NULL,
   prodId BIGINT UNSIGNED NOT NULL,
   createTs TIMESTAMP not null default current_timestamp,
   foreign key bid_user_id_fk (buyerId) references users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
   foreign key bid_prod_id_fk (prodId) references products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE questions (
    id BIGINT unsigned auto_increment primary key,
    userId BIGINT UNSIGNED NOT NULL,
    productId BIGINT UNSIGNED NOT NULL,
    note TEXT NOT NULL,
    createTs TIMESTAMP NOT NULL default current_timestamp,
    foreign key quest_user_id_fk (userId) references users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    foreign key quest_prod_id_fk (productId) references products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE answers (
    id BIGINT unsigned auto_increment primary key,
    questionId BIGINT UNSIGNED NOT NULL,
    userId BIGINT UNSIGNED NOT NULL,
    note TEXT NOT NULL,
    createTs TIMESTAMP NOT NULL default current_timestamp,
    foreign key ans_ques_id_fk (questionId) references questions(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    foreign key ans_user_id_fk (userId) references users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE prodImages ( 
    id BIGINT unsigned auto_increment primary key,
    productId BIGINT unsigned NOT NULL,
    image VARCHAR (500) NOT NULL,
    imageType VARCHAR (4) NOT NULL,
    createTs TIMESTAMP NOT NULL default current_timestamp,
    FOREIGN KEY pimg_prod_id_fk(productId) REFERENCES products (id)ON DELETE RESTRICT ON UPDATE CASCADE
);