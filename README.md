## Instructions to run the backend (in the `/backend` folder)
1. run `npm install` to install all the dependencies
2. run `npm run start` to start the backend server (running on `http://localhost:8000`)

## Instructions to run the frontend (in the `/frontend` folder)
1. run `npm install` to install all the dependencies 
2. run `npm run start` to start the frontend server (running on `http://localhost:3000`)

## Instructions to run the unit testing (in the `/backend` folder)
1. use the frontend page to reset redemptions 
2. run `npm test` to run all 6 unit tests

## Tech stacks used 
- Database: Firebase
- Backend: Node.js and Express.js, codes written in Typescript
- Frontend: React.js and Material UI, codes written in Typescript
- Testing: Mocha and Chai

## Instructions to use the frontend 
- Enter a staff pass ID
  - Click on the 'Check Valid Staff Pass ID' button to check if the staff pass ID exists
      - Possible results:
          - Staff ID exists and hence is valid
          - Staff ID do not exists and hence is not valid 
  - Click on the 'Redeem Gift for Team' button to indicate that the staff is collecting their team's gift
      - Possible results:
          - Staff ID is not valid, user needs to key in a valid staff ID to proceed
          - The team's gift has already been redeemed, staff cannot redeem gift for team again
          - Staff successfully collects their team's gift
  - Results will be shown at the bottom of the screen in the form of a snackbar
- Reset the redemptions
  - This button is for admin to clear all the redemptions that have been made
  - All users running this app will edit the same database, hence another user's action may interfere with your results

## Assumptions 
- Staff pass ID is case insensitive 
