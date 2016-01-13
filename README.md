# Munch
A Meal-Sharing Platform for Today's College Student

## Synopsis

Presently, college students do not have a food-source designed with their needs in mind. The options available are: 

* Fast Food: Very affordable, fast, and convenient. It even tastes really good if you don’t have too much. However, fast food meals can often surpass 1000 calories, and even in moderation, fast food is simply not good for you. It’s cheap, but you get what you pay for. A fast-food diet is unsustainable.

* Restaurants: Not as unhealthy as fast-food, and can taste even better, but not affordable. Eating at a restaurant for every meal can cost more than most college students can afford.

* Home Cooking: Much more affordable than eating at restaurants, the quality is miles above fast food, and it brings along the satisfaction of making something out of nothing. However, the time investment required can be up to multiple hours, more than many college students wish to spend.

Each option has its pros and cons, but the best choice nutritionally and monetarily is cooking at home. This method’s inefficiencies are only time-related; is spending 3 hours grocery shopping and cooking for one meal worth it? Probably not, so many students cook in bulk and make a week’s worth of food at a time. Those students are now stuck eating the same food for a week, though, which can get old fast.

Munch, a meal-sharing platform, tackles this inefficiency directly. Munch gives college students with culinary skills and time to spare the opportunity to share their meals with fellow students, providing a safe, convenient, affordable, and healthy alternative to fast food. These students, referred to as “chefs”, can earn supplemental income by sharing their meals through Munch.

## A Meal-Sharing Platform

The sharing economy is growing like wildfire. This should be no surprise; by pooling our excess resources, whether they be an empty room as is the case with AirBNB or a car such as with Uber, we can live our lives much more effectively and efficiently. Sharing benefits everyone, both those receiving a service and those providing it. Taking an Uber is much more convenient than driving somewhere and worrying about parking, so the rider benefits from a quick, easy ride. The driver is rewarded monetarily for his time as well as for using his own vehicle to provide the ride.  People in both roles are better off than they were before this service.

Munch is based on a similar ideology. Munch allows anyone, anywhere, to share their excess resources in the form of home-cooked meals with those around them. This is not only more efficient and more convenient for all involved, but it also brings people together with their neighbors over the one thing almost all humans love: food. If I decide to go grocery shopping and cook a meal, I no longer have to invest hours into making one plate of food. I also don’t have to be stuck with bulk portions for the foreseeable future. Instead, I can use Munch to let anyone around me know there is a home-cooked meal waiting for them nearby, for a reasonable price. In return, I receive monetary compensation for my time and efforts invested into preparing a meal.

This provides a valuable fourth option for today’s college student on a budget. Through Munch, you can find affordable, nutritious meals in your own neighborhood.

## Database

Munch employs a MySQL database running on an Ubuntu 14.04 server. 

Munch’s database consists of three primary tables, encompassing the features offered by Munch. These are:

#### Users

Unique indexes ensure no two users can share a username or email. The password field is a character array meant to contain the users already-hashed password. The user's password is never stored in plaintext.

```
	CREATE TABLE Users( 
    		id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
  	   	username VARCHAR(20) NOT NULL, 
    		email VARCHAR(30) NOT NULL, 
    		password CHAR(60) NOT NULL, 
        		PRIMARY KEY (id), 
    		UNIQUE INDEX username_UNIQUE (username), 
    		UNIQUE INDEX email_UNIQUE (email) 
	);
```

#### Meals

The eatby attribute represents the time by which the meal must be ordered. It has one foreign key, chefid, which holds the value of the user id belonging to the user who prepared the meal. Upon deletion of a user, all his meals will also be deleted from the database.

```
  	CREATE TABLE Meals( 
    		id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    		chefid INT UNSIGNED NOT NULL, 
 	   	price DECIMAL(3,2) NOT NULL, 
    		title VARCHAR(30) NOT NULL, 
    		location VARCHAR(120) NOT NULL, 
    		created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    		eatby DATETIME NOT NULL, 
      		PRIMARY KEY(id), 
      		FOREIGN KEY (chefid)  
        		REFERENCES  Users(id)  
        		ON DELETE CASCADE 
	);
```

#### Orders

In addition to the foreign keys referencing each meal’s id and customer’s id, there is a unique index of mealid and custid attributes, ensuring no user can ever rate the same meal twice, but rather must update their existing rating for said meal.

```
  CREATE TABLE Orders( 
    		id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    		mealid INT UNSIGNED NOT NULL, 
    		custid INT UNSIGNED NOT NULL, 
    		rating INT, 
    		placed TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    		PRIMARY KEY(id), 
    		FOREIGN KEY(mealid) 
      		REFERENCES Meals(id) 
      		ON DELETE CASCADE, 
    		FOREIGN KEY(custid) 
      		REFERENCES Users(id) 
      		ON DELETE CASCADE, 
      		UNIQUE INDEX orders_UNIQUE (mealid, custid) \
	);
```

#### Multi-Table Queries

Displaying a user's thorough meal information requires querying multiple tables. An example query could be:

```
  SELECT  orders.id,
          orders.rating,
          orders.mealid, 
          orders.custid, 
          orders.rating, 
          meals.chefid, 
          meals.price, 
          meals.title, 
          meals.location, 
          orders.placed, 
          meals.eatby 
  FROM orders INNER JOIN meals on orders.mealid = meals.id 
  WHERE custid = _;
```

This query takes advantage of orders having a foreign key (mealid) referencing the primary key of the meals table. Instead of having to populate a new table that can hold all these values and provide them when I need them, a join query works much better.

## Functionality

### Menu

Allows browsing of list of all available meals on Munch. Incorporates a search field allowing the user to narrow down the area which they want visible on their menu. This is done by pattern matching the stored location of each meal with a term provided by the user through the search bar. From here, orders can be placed as well and if the user owns a meal, he can delete it from the menu.

Example query narrowing down meals by location:
`SELECT * FROM Meals WHERE location LIKE ‘%Tallahassee%’;`

### Cook

Allows posting of own meals to database, making meal visible on the site’s menu to all users. After posting, the user is redirected back to the menu where their meal is now visible.

### My Orders

Allows the user to see all orders they have placed. From there, they can follow a link to the meal’s page, or to the order’s page. The order page allows the user to delete his order, removing it from the database.

## Implementation Details

Munch is a web application. It requires constant communication with a server (i.e. cannot be used “offline”) and will require continuous maintenance to keep up with new web standards and technologies. For this reason, I chose to write it almost all in Javascript. This allowed me to write both the front-end and back-end logic in the same language, simplifying the development process. Because I worked on my own, I decided it would be better to narrow it down to one language I could learn very well and use everywhere. 

The server-side logic runs on Node.JS, “open source, cross-platform runtime environment for developing server-side web applications.” It utilizes Google’s V8 engine to execute code, and has an impressive open-source community providing many pre-built packages.

#####Notable Packages Used
* Express: A “fast, unopinionated, minimalist web framework for Node.js”, Express offers a great balance of pre-built functionality and customizability. It makes many things (routing in particular) much easier, but doesn’t hold your hand through the process the way Rails can be known to do. My use of Express consisted mostly of its routing abilities.
* Passport.JS: A light-weight authentication library. It was chosen over popular competitor EveryAuth due to its customizability and transparency. It allows you full control over the authentication process, rather than abstracting it away from you.
* Node-MySQL: a node.js driver for MySQL, Node-MySQL simplifies the process of connecting to the database from within Munch’s javascript code, as well as executing queries.
* Async: Used to implement asynchronous database calls. Because some queries depend on the results of other queries, building Munch required careful control of exactly what was executed, and when.
* Bootstrap: Twitter’s Bootstrap is a package of pre-built CSS rules. This made Munch much less ugly.

Munch runs on an Ubuntu 14.04 server hosted by digital ocean. Having this server to work on made testing much easier, as I was able to see the final product on an actual live website. Its front-end is static HTML compiled by the server. Through express, I implemented the Handlebars view engine. This allowed me to implement templates, greatly reducing code repetition throughout the codebase. This also allowed me to inject data from the server directly into the site being served to the user. Front-end frameworks such as React and Angular were considered, but decided against for simplicity’s sake. The application’s front-end logic is handled with get and post requests and redirects. In the future, Munch may be rebuilt as a single-page application built with React components.

