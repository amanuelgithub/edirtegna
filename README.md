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
