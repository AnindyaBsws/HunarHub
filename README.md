UNDER CONSTRUCTION!!


# HunarHub
<!-- Development/Production (Primary DB) -->
node server.js



<!-- Testing(Test DB) -->
# 1. Reset DB
npx dotenv -e .env.test -- npx prisma migrate reset --force

# 2. Start server
npx dotenv -e .env.test -- node server.js
(Run tests / Postman)

#3. Open the Test DB
npx dotenv -e .env.test -- npx prisma studio

#4.To run the test files
npx dotenv -e .env.test -- npm test


UNDER CONSTRUCTION!!
