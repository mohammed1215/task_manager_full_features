# Stage 1: Build the app
FROM node:20-alpine AS build
# (جديد) تثبيت pnpm ليتوافق مع مشروعك
RUN npm install -g pnpm
WORKDIR /app
# (جديد) نسخ ملف pnpm-lock.yaml مع package.json
COPY package.json pnpm-lock.yaml ./
# استخدام pnpm بدلاً من npm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Production environment
FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# تثبيت حزم الـ production فقط لتقليل المساحة
RUN pnpm install --prod --frozen-lockfile
# We copy the 'dist' folder from the stage we named 'build'
COPY --from=build /app/dist ./dist

# (تعديل احترافي): تشغيل node مباشرة أفضل من استخدام npm كـ wrapper
CMD ["node", "dist/main.js"]
