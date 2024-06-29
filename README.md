This is a [`Next.js`](https://nextjs.org/) Personal Portfolio project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Heavily adopted from: [CodeBucks: Build an Amazing Personal Portfolio Website with Next.js, Three.js & Tailwind CSS
](https://www.youtube.com/watch?v=T5t46vuW8fo&t=217s)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## For Docker Users

**Building from Local**

Simply pull the Github's repository down and run the following command

```bash
docker build -t <your-prefer-image-name> -f ./Dockerfile .
```

Once your image has successfully built, run the following command to get started with the project

```bash
docker run --name portfolio-container -p 3000:3000 portfolio-nextjs
```

Or you can go with the `docker-compose.yml` for buiding easier, the `docker-compose.yml` could be implemented as following:

```docker
#docker-compose.yml
version: "3.9"

services:
  nextapp:
    container_name: nextapp
    image: nextapp
    build: .
    ports:
      - "3000:3000"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Building from Repository**

To get started, pull the image from the Docker Hub's repository :

```bash
docker pull cobeo2004/portfolio-nextjs:production
```

After the image is successfully pulled, run the following command to build the image:

```bash
docker build -t cobeo2004/portfolio-nextjs:production .
```

Once the image is built, run the container using the following command:

```bash
docker run --name <your-preffered-name-for-container> -p 3000:3000 cobeo2004/portfolio-nextjs:production
```

Or you can go with the `docker-compose.yml` for buiding easier, the `docker-compose.yml` could be implemented as following:

```docker
#docker-compose.yml
version: "3.9"

services:
  portfolio-nextjs:
    container_name: portfolio-nextjs
    image: cobeo2004/portfolio-nextjs:production
    build: production
    ports:
      - "3000:3000"

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
