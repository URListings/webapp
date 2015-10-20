**URListings**

**Team members:**

1. Kanishk Tripathi (ktripath@ur.rochester.edu)

2. Jingwei Xu (jxu45@UR.Rochester.edu)

**Problem statement**

1. Students often have items for sale(furniture, appliances, car) whether they are moving out or just selling an old item. There're students who need such items especially when they have just moved in or moved to a new off campus housing.
2. Graduate students or undergraduates who live in off campus housing often require roommates to share the rental and other costs.

**Current methods**
One of the most popular ways to do this is through craigslist. Another method is through fliers on noticeboards. The Chinese students also have a mailing list for these purposes. There're also facebook groups where people post such requirements.

**Disadvantages of the above methods:**

1.Craigslist is huge. Postings get burried. The sale can be at a place where distance from campus is big. This may not be good for someone who is new to the place. Many people may not be aware of facebook groups and posts can get lost among others.

2.The fliers on campus noticeboards contain almost every type of information(events, ads etc.). This information can be easily lost in there. Also using flyers wastes paper and has printing cost.

3.The mailing list requires a person to re-post the ad after two weeks. Also the ad maybe there even after the purpose of it may have been solved.

**Purpose**
The purpose of this webapp is to allow the students to search for items on sale by other students in the same unviersity campus. Another feature we're trying to implement is to search for probable roommates for off-campus or graduate housing.

**Proposed features**

1.To login using the UofR email id. The account will be confirmed after the validation from email.

2.The feature to post a sale item along with a category(furniture, household appliance, vehicle).

3.The feature to post roommate search listing. As a stretch goal, we can integrate with Google maps for location. The user can get address by pin-pointing or by typing the address and then getting the location.

4.To post an expiry date on the ad after which the listing won't be visible to other users. This feature won't make the user re-post the listing. The user can simply change the expiry date. Also the user can delete the listing.

The listings and their responses will be stored in a data store. So far MySQL will be the choice but we can also experiment with NoSQL like MongoDB.

In both feature 2 and 3, the user will also have the option to upload the images. We'll try to work with aesthetics and single page application concept.

