---
layout: post
title:  "Refactor on the go"
date:   2020-07-29
categories: jekyll update
---

# Break up database references

## Problem
* You are splitting up one microservice with db access into multiple
* Your database schema has to split up as some entities go into the other service

## Solution
* Use business keys to address new table
* Use migration scripts to 

## Demo Environment
``` sql
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS contacts;

CREATE TABLE customers(
   customer_id serial not null,
   customer_name VARCHAR(255) NOT NULL,
   PRIMARY KEY(customer_id)
);

CREATE TABLE contacts(
   contact_id serial not null,
   customer_id INT,
   contact_name VARCHAR(255) NOT NULL,
   phone VARCHAR(15),
   email VARCHAR(100),
   PRIMARY KEY(contact_id),
   CONSTRAINT fk_customer
      FOREIGN KEY(customer_id) 
	  REFERENCES customers(customer_id)
);
```
from https://www.postgresqltutorial.com/postgresql-foreign-key/


Insert Customers
``` sql
insert into customers (customer_name) values ('marco'), ('peter'), ('kim')
```

Insert Contacts
``` sql
insert into contacts (customer_id, contact_name, phone, email) values
	(1, 'marco', '1234', 'marco@mail.com'),
	(2, 'peter', '56789', 'peter@mail.com'),
	(3, 'kim', '78956', 'kim@mail.com');
```

Create new business key column to replace foreign key
``` sql
alter table contacts add column customer_name_key varchar(255);
```

Copy business keys into new column
``` sql
update contacts set customer_name_key=customers.customer_name
  from customers where customers.customer_id = contacts.customer_id;
```

Add additional constraint `NOT NULL` to new business key column to verify set foreign key.
``` sql
alter table contacts alter column customer_name_key set not null;
```

Delete replaced foreign key
``` sql
alter table contacts
	drop constraint fk_customer;
alter table contacts
	drop column customer_id;
```


