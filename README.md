Step 1: Initialize Project & Install Dependencies

# 1. Create project and init npm
npm init -y
# 2. Install TypeScript and development tools
npm install typescript ts-node nodemon @types/node @types/express @types/cors @types/morgan --save-dev
# 3. Install Core dependencies
npm install express prisma @prisma/client dotenv cors helmet morgan
# 4. Initialize TypeScript configuration
npx tsc --init

Step 2: Configure TypeScript (tsconfig.json)

Open the generated tsconfig.json and ensure these settings are active (uncommented) to make development smoother:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}

Step 3: Setup Prisma & PostgreSQL

# 1. Initialize Prisma:
npx prisma init

# 2. Configure .env:
Open the .env file created in your root folder. Change the DATABASE_URL to point to your local Postgres:

# 4. Define the Schema:
Open prisma/schema.prisma   and define the models.

Step 4: Run First Migration
This command creates the tables in PostgreSQL and generates the TypeScript client.
npx prisma migrate dev --name init_schema

Step 5: Add Scripts to package.json

"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon src/index.ts",
  "build": "tsc"
}

# How to Run:
npm run dev