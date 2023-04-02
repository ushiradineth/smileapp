# SmileApp | CIS - UOB Third Year First Semester

This is a project created for my CS Degree third year first semester module Comparative Integrated Systems.
The basis of this App is to use the given API and interact with it.
This app has magic link login, github login, guest play, leaderboard and leveling systems.

## Technologies used

- NextJS
- TypeScript
- tRPC
- AuthJS
- Prisma
- Tailwind CSS
- Zod
- PostgreSQL
- UI Primitives by [Shadcn](https://ui.shadcn.com/)
- [Figma](https://www.figma.com/file/z7ON5TcP6j8FNbOMVhEnu6/SmileApp?node-id=0%3A1&t=VQNkqprZteGAsejS-1)

## Hosting

- Hosted on Vercel
- Database and storage on Supabase

## How to run this website

- This website is currently live on [Vercel](https://smileapp.vercel.app/)
- But if it is required to run this website locally, there are two viable options.
  - Yarn (NPM and Nodejs are required)
    - Run `npm install --global yarn`
    - Run `yarn`
    - Run `yarn start`
    - Visit [localhost:3000](localhost:3000) to view the website
  - Docker (Docker is required)
    - Run `docker compose up`
    - Visit [localhost:3000](localhost:3000) to view the website
  - **Warning: These methods may not work as intended. This project was built to run specifically on Vercel.**
  - **Warning: localhost:3000 might be preoccupied, NextJS will try to use the next closest port in such instances, check console to verify.**
