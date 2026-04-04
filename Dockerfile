# ১. বিল্ড স্টেজ (Build Stage)
FROM node:22-alpine AS builder
WORKDIR /app

# pnpm সেটআপ
RUN npm install -g pnpm

# শুধু প্যাকেজ ফাইল এবং প্রিজমা আগে কপি করা (Cache Optimization)
COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma/

# ডিপেন্ডেন্সি ইনস্টল করা
RUN pnpm install --frozen-lockfile

# বাকি সব সোর্স কোড কপি করা
COPY . .

# বিল্ডের জন্য ফেক এনভায়রনমেন্ট ভেরিয়েবল (Next.js এর বিল্ড রিকোয়ারমেন্ট)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXTAUTH_SECRET="dummy-secret-for-build"

# নেক্সট বিল্ড (এটি .next/standalone ফোল্ডার তৈরি করবে)
RUN pnpm run build

# ২. রানার স্টেজ (Runner Stage) - হালকা ওজন করার জন্য
FROM node:22-alpine AS runner
WORKDIR /app

# প্রোডাকশন এনভায়রনমেন্ট সেট করা
ENV NODE_ENV=production

# Standalone মোডে প্রয়োজনীয় ফাইলগুলো কপি করা
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# নোট: Standalone মোডে server.js অটোমেটিক তৈরি হয় যা অ্যাপ রান করে
EXPOSE 3000

# অ্যাপ স্টার্ট করা (node server.js ই হলো স্ট্যান্ডার্ড ওয়ে)
CMD ["node", "server.js"]