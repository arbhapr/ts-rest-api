# Setup Project

-   Copy or rename .env.example file to be .env
-   Fill the connection of database using Prisma ORM, learn more at **[Prisma Docs](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)**

```shell
npm install
npx prisma migrate dev
npx prisma generate
npm run build
npm run start
```

This application created by **[Arbha Pradana](https://linkedin.com/in/arbhapr)**
<br>
Following tutorial from **[Tutorial TypeScript RESTful API (Bahasa Indonesia)](https://www.youtube.com/watch?v=1-eEEJF5LCc)**
