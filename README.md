# kierian-assessment

# How to use the application
1. clone this repo on your local machine
2. install the dependencies by running  npm install
3. create a .env file at the root of the application
4. add entry for JWT_SECRETE and SERVER_PORT on the .env file created(JWT_SECRETE is any secret string and SERVER_PORT is any 4 digit number)
5. Login with the following credential on postman <br />
     endpoint= POST /api/v1/login
    "userId": "c231139d-1369-4a3e-975f-c0e0dcc0ab42",
    "password": "P@ssw0rd!"
6. copy the response token
7. use the response token to make subsequent request by hitting the following endpoint<br />
   GET /api/v1/:amount/:walletId/:pin/:otp
8. replace :amount with 50000000 or any valid amount , :walletId 4 or any valid walletId from (1-5), :pin with 4732 or any valid pin, :otp with 991301 or any valid otp
9. hit the following endpoint on postman to view the activity log generated during the transaction process<br />
    GET /api/v1/audit-trail
