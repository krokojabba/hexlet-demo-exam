DROP DATABASE IF EXISTS demo;
CREATE DATABASE demo;

\c demo

-- ---------------------------------------------------------------------- partner_types-------------------------
create table partner_types (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	type varchar(50)
);

insert into partner_types (type) values 
	('АО'),
	('ООО'),
	('ИП')
;

select * from partner_types;

-- ---------------------------------------------------------------------- partners -----------------------------
create table partners (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	partner_type_id bigint references partner_types(id) not null,
	name varchar(50) not null,
	fio varchar(50) not null,
	phone_number varchar(50) not null,
	email varchar(50) not null,
	address varchar(255) not null,
	rating bigint not null
);

insert into partners (partner_type_id, name, fio, phone_number, email, address, rating) values 
	(1, 'test_name_1', 'test_fio_1', '+7111111111', 'test_email_1@example.com', 'test_adress_1', 10),
	(2, 'test_name_2', 'test_fio_2', '+7222222222', 'test_email_2@example.com', 'test_adress_2', 20),
	(3, 'test_name_3', 'test_fio_3', '+7333333333', 'test_email_3@example.com', 'test_adress_3', 30)
;

select * from partners;

-- ---------------------------------------------------------------------- product_types ------------------------
create table product_types (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	type varchar(50)
);

insert into product_types (type) values 
	('Паркетная доска'),
	('Ламинат')
;

select * from product_types;

-- ---------------------------------------------------------------------- products -----------------------------
create table products (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	product_type_id bigint references product_types(id) not null,
	article varchar(50) not null,
	name varchar(50) not null,
	min_price decimal not null
);

insert into products (product_type_id, article, name, min_price) values 
	(1, '111', 'Паркетная доска 1', 100),
	(2, '222', 'Ламинат 1', 200)
;

select * from products;

-- ---------------------------------------------------------------------- sales ------------------------------

create table sales (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	product_id bigint references products(id) not null,
	partner_id bigint references partners(id) not null,
	amount decimal not null,
	sale_date date not null
);

insert into sales (product_id, partner_id, amount, sale_date) values 
	(1, 1, 10000.0, '01-01-2024'),
	(2, 2, 20000.0, '02-01-2024'),
	(1, 2, 30000.0, '03-01-2024')
;

select * from sales;