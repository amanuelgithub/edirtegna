### setup

- database & typorm
  - pnpm add typeorm reflect-metadata --save --filter=server
  - then import - import "reflect-metadata"
  - pnpm add mysql2 --save --filter=server
-

- Setting Up the Authentication - for the serve
- Neccessary packages
  - pnpm add jsonwebtoken passport passport-jwt bcrypt --filter=server
  - pnpm add --save-dev @types/bcrypt @types/passport-jwt --filter=server

### Steps to create the "trpc-server" package

---

```

cd to packages

mkdir trpc-server

pnpm init

```

- Modify the created package.json

  - changed the name of the package to follow monorepo package naming convention.

  ```json
  {
    "name": "@edirtegna/trpc-server",
    "version": "1.0.0",
    "description": "",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
      "build": "rm -rf ./dist && tsc"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
      "@trpc/server": "^10.45.2",
      "@types/node": "^20.3.1",
      "zod": "^3.24.1"
    },
    "devDependencies": {
      "typescript": "^5.7.3"
    }
  }
  ```

- Generate and setup the tsconfig.json

  ```
  npx tsc --init
  ```

  - configurations I've added are

  ```json
  {
    "compilerOptions": {
      "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
      "module": "commonjs" /* Specify what module code is generated. */,
      "rootDir": "./src" /* Specify the root folder within your source files. */,
      "moduleResolution": "node10" /* Specify how TypeScript looks up a file from a given module specifier. */,
      "declaration": true /* Generate .d.ts files from TypeScript and JavaScript files in your project. */,
      "outDir": "./dist" /* Specify an output folder for all emitted files. */,
      "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
      "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
      "strict": true /* Enable all strict type-checking options. */,
      "skipLibCheck": true /* Skip type checking all .d.ts files. */
    },
    "include": [
      "."
    ] /* Includes everything in the specified rootDir path with exception to the file types specified in the exclude array */,
    "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.spec.ts"]
  }
  ```
