# Bloqit Challenge

This repository contains my solution to Bloqit's software engineering challenge. As per the instructions, it was implemented using NodeJS + Typescript + Express. Additionally, I chose to use MongoDB as a database.

## Run

With docker:
```
> docker-compose build
> docker-compose up
```

Without docker (requires a MongoDB instance running locally on `mongodb://127.0.0.1:27017`):
```
> npm install
> npm run start
```

## Test

To test the application, we can run the following command:
```
> npm run test
```
Note: this will also trigger an end-to-end test which requires a MongoDB instance running on `mongodb://127.0.0.1:27017`. If the instance is not available, all other tests will still work.

For test coverage:

```
npm run test:coverage
```

## API

The following endpoints were implemented:
```
GET api/bloqs - returns a list of bloqs. Optionally, can be filtered with query params, e.g. api/bloqs?title=BestBloq
GET api/bloqs/:id - returns a single bloq by ID
POST api/bloqs - creates a bloq 
PUT api/bloqs/:id - updates a bloq if :id exists
DELETE api/bloqs/:id - deletes a bloq if :id exists

GET api/lockers - returns a list of lockers. Optionally, can be filtered with query params, e.g. api/lockers?status=locked
GET api/lockers/:id - returns a single locker by ID
POST api/lockers - creates a locker 
PUT api/lockers/:id - updates a locker if :id exists
DELETE api/lockers/:id - deletes a locker if :id exists

GET api/rents - returns a list of rents. Optionally, can be filtered with query params, e.g. api/rents?size=xl
GET api/rents/:id - returns a single rent by ID
POST api/rents - creates a rent. If the rent is created with a locker ID, it checks whether the locker is empty and updates it accordingly, otherwise fails.
PATCH api/rents/:id - updates a rent if :id exists. If lockerId is updated, it checks whether the new locker is empty and updates it accordingly, otherwise fails.
DELETE api/rents/:id - deletes a rent if :id exists
```

GET endpoints can be accessed without authorization. For other endpoints, we must first login and use the resulting token as a Bearer token for subsequent requests:
```
/login

curl --request POST \
  --url http://localhost:3000/login \
  --header 'Content-Type: application/json' \
  --data '{
	"username": "writeUser",
	"role": "write"
}'
```
For testing, I used an Insomnia collection which can be found in the project root, `bloqit-collection.json`.


## Implementation notes

- API endpoints - After checking the requirements, I chose to implement CRUD endpoints for all three resources, Bloqs, Lockers and Rents. As such, I ended up with a very similar implementation for all three resources with significant duplication. To solve that, I opted to implement a generic controller and service, which are then extended by each resource. Then, for each resource, I implemented only the behaviour that is specific to that resource. An example is the `rent.service.ts` file, which implements `create` and `update` functions that override the generic behaviour.
- Unit tests - I implemented extensive unit tests, and you may notice that the tests are very similar for bloqs, lockers and rents. Using my generic approach described above, I ended up with code that is very similar on the unit tests as well. I thought of only implementing tests for one of the resources, but ultimately decided against it due to the fact that in a real world application, the code may change and implement new behaviour. If the code behaves differently, unit tests should fail and this implementation guarantees that.
- E2E tests - I included a simple e2e test that performs some simple requests to the API and makes use of a test database to check the results.
- Users - the requirements made no mention of users/login/authentication. However, given the specific details of the application, I thought it would make sense to have some endpoints unavailable to the general public, e.g. anyone can see if a locker is occupied, but not everyone should be able to remove its contents. As such, I implemented a 'write' role and a login endpoint which, when called with hardcoded values `{ username: 'writeUser', role: 'write' }`, will return a bearer token which can then be used in all subsequent API calls and provides full write access. 
