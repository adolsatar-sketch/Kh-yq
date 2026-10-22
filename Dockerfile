# صورة واحدة تخدم الموقع وغرف اللعب عن بعد (WebSocket على /ws)
FROM node:22-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev
COPY . .
ENV PORT=8787 SERVE_STATIC=1
EXPOSE 8787
USER node
CMD ["node", "server/relay.mjs"]
