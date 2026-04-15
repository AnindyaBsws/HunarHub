UNDER CONSTRUCTION!!


# HunarHub
<!-- Development/Production (Primary DB) -->
node server.js

<!-- Testing(Test DB) -->
#1.Reset DB
npx dotenv -e .env.test -- npx prisma migrate reset --force
#2.Start Server
npx dotenv -e .env.test -- node server.js
(Run tests / Postman)
#3. Open the Test DB
npx dotenv -e .env.test -- npx prisma studio
#4.To run the test files
npx dotenv -e .env.test -- npm test



<!-- Customized Scripts to run the app -->

1. Run dev server (Primary DB, Runs tests using .env)  : npm run dev

2. Reset test DB only                                  : npm run test:db:reset
3. Run tests (test DB, Runs tests using .env.test)     : npm run test:run
4. Does Everything for Tests(Reset DB Run all tests.   : npm run test:full
Sequential execution)
5. Open Test Db GUI                                    : npm run test:studio


<!-- ... -->

UNDER CONSTRUCTION!!
