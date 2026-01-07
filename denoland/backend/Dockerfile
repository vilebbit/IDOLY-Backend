# Build stage
FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
# Install dependencies (use just `deno install` if deno.json has imports)
RUN deno install --entrypoint main.ts
RUN deno task build

# Production stage
FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
ENV DENO_ENV=production
CMD ["deno", "run", "-A", "main.ts"]
