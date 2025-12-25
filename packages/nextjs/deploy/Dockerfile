FROM node:21.7.1-alpine3.19 AS BUILDER
WORKDIR /usr/src/app

# Rust building
RUN apk add --no-cache wasm-pack
ADD wasm-lib wasm-lib 
RUN cd wasm-lib && wasm-pack build --target web --out-dir pkg

# Nextjs building
COPY package.json package-lock.json ./
RUN npm install
COPY . . 

# Traigo las variables de entorno de render
ARG RENDER
ARG NEXT_PUBLIC_BACKEND_URL
RUN npm run build

FROM node:21.7.1-alpine3.19 AS RUNNER
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app/.next/standalone ./
COPY --from=BUILDER /usr/src/app/.next/static ./.next/static
COPY --from=BUILDER /usr/src/app/public ./public
ENV HOSTNAME=0.0.0.0
CMD node server.js