
module.exports = app => {
const clients = require("../controllers/clients.controller.js");
const router = require("express").Router();
/**

@swagger
/clients:
post:
summary: Create a new client
requestBody:
required: true
content:
application/json:
schema:
type: object
properties:
full_name:
type: string
phone_number:
type: string
email:
type: string
password:
type: string
address:
type: string
referred_by_id:
type: integer
example:
full_name: "John Doe"
phone_number: "+123456789"
email: "john@example.com"
password: "securepassword"
address: "123 Street"
referred_by_id: 1
responses:
201:
description: Client created
500:
description: Error creating client
*/
router.post("/", clients.create);

/**

@swagger
/clients:
get:
summary: Retrieve a list of all clients
responses:
200:
description: A list of clients
content:
application/json:
schema:
type: array
items:
type: object
properties:
id:
type: integer
full_name:
type: string
phone_number:
type: string
email:
type: string
password:
type: string
address:
type: string
referred_by_id:
type: integer
500:
description: Error retrieving clients
*/
router.get("/", clients.findAll);

/**

@swagger
/clients/{id}:
get:
summary: Retrieve a client by ID
parameters:

in: path

name: id
required: true
schema:
type: integer
responses:
200:
description: Client found
content:
application/json:
schema:
type: object
properties:
id:
type: integer
full_name:
type: string
phone_number:
type: string
email:
type: string
password:
type: string
address:
type: string
referred_by_id:
type: integer
404:
description: Client not found
500:
description: Error retrieving client
*/
router.get("/:id", clients.findOne);

/**

@swagger
/clients/{id}:
put:
summary: Update a client by ID
parameters:

in: path

name: id
required: true
schema:
type: integer
requestBody:
required: true
content:
application/json:
schema:
type: object
properties:
full_name:
type: string
phone_number:
type: string
email:
type: string
password:
type: string
address:
type: string
referred_by_id:
type: integer
responses:
200:
description: Client updated
404:
description: Client not found
500:
description: Error updating client
*/
router.put("/:id", clients.update);

/**

@swagger
/clients/{id}:
delete:
summary: Delete a client by ID
parameters:

in: path

name: id
required: true
schema:
type: integer
responses:
200:
description: Client deleted
404:
description: Client not found
500:
description: Error deleting client
*/
router.delete("/:id", clients.delete);

/**

@swagger
/clients:
delete:
summary: Delete all clients
responses:
200:
description: All clients deleted
500:
description: Error deleting clients
*/
router.delete("/", clients.deleteAll);

/**

@swagger
/clients/{id}/referredby:
get:
summary: Get referred by information for a client
parameters:

in: path

name: id
required: true
schema:
type: integer
responses:
200:
description: Referred by info
404:
description: Not found
500:
description: Error retrieving referred by info
*/
router.get("/:id/referredby", clients.getReferredBy);

/**

@swagger
/clients/{id}/referredby-param:
get:
summary: Get referred by information for a client with parameterization
parameters:

in: path

name: id
required: true
schema:
type: integer
responses:
200:
description: Referred by info
404:
description: Not found
500:
description: Error retrieving referred by info
*/
router.get("/:id/referredby-param", clients.getReferredByParam);

/**

@swagger
/clients/{id}/referrals:
get:
summary: Get list of referrals for a client
parameters:

in: path

name: id
required: true
schema:
type: integer
responses:
200:
description: List of referrals
500:
description: Error retrieving referrals
*/
router.get("/:id/referrals", clients.getReferrals);

/**

@swagger
/clients/statistics/referrals:
get:
summary: Get referral statistics
responses:
200:
description: Referral statistics
500:
description: Error retrieving statistics
*/
router.get("/statistics/referrals", clients.getReferralStatistics);

/**

@swagger
/clients/search/email:
get:
summary: Find clients by email part
parameters:

in: query

name: email
required: true
schema:
type: string
responses:
200:
description: List of clients
400:
description: Email part required
500:
description: Error searching clients
*/
router.get("/search/email", clients.findByEmailPart);

/**

@swagger
/clients/top-referrers:
get:
summary: Get top referrers
parameters:

in: query

name: limit
schema:
type: integer
description: Number of top referrers (default 5)
responses:
200:
description: List of top referrers
500:
description: Error retrieving top referrers
*/
router.get("/top-referrers", clients.getTopReferrers);

/**

@swagger
/clients/search/city:
get:
summary: Find clients by city (from address)
parameters:

in: query

name: city
required: true
schema:
type: string
responses:
200:
description: List of clients
400:
description: City required
500:
description: Error searching clients
*/
router.get("/search/city", clients.findByCity);

/**

@swagger
/clients/root-clients:
get:
summary: Get root clients (without referrers)
responses:
200:
description: List of root clients
500:
description: Error retrieving root clients
*/
router.get("/root-clients", clients.getRootClients);

/**

@swagger
/clients/duplicates/email:
get:
summary: Find email duplicates
responses:
200:
description: List of duplicates
500:
description: Error retrieving duplicates
*/
router.get("/duplicates/email", clients.findEmailDuplicates);

/**

@swagger
/clients/activity/monthly:
get:
summary: Get monthly activity analysis
responses:
200:
description: Monthly activity
500:
description: Error retrieving activity
*/
router.get("/activity/monthly", clients.getMonthlyActivity);

app.use("/api/clients", router);
};