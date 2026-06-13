# Project Name
InputMatter

## Overview
InputMatter is a customer feedback platform for cafes, shops, and restaurants. Customers can leave a short description of their experience, tag it with one or more categories (Tech, Taste, Business, Service, Environment, Media), and associate it with a specific venue. The goal is to make it frictionless for customers to surface meaningful, categorized feedback to business owners.

> **Note:** This repository contains the **backend** of the InputMatter platform only. It is a REST API server that the frontend client communicates with.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS 11](https://nestjs.com) + TypeScript |
| Runtime | [Node.js](https://nodejs.org) |
| Package manager | [npm](https://www.npmjs.com) |

## Running the code

Install dependencies:

```bash
npm install
```

Start the development server (watch mode):

```bash
npm run start:dev
```

Build for production:

```bash
npm run build
```

Run in production mode:

```bash
npm run start:prod
```
