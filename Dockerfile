# 1. تحديد النسخة (Base Image)
FROM node:20-alpine

# 2. تحديد فولدر الشغل جوه الحاوية
WORKDIR /usr/src/app

# 3. نسخ ملفات التعريف وتثبيت المكتبات
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 4. نسخ باقي الكود
COPY . .

# 5. عمل Build للمشروع
RUN pnpm run build

# 6. فتح بورت التطبيق
EXPOSE 3000

# 7. أمر التشغيل# استخدم نسخة Node 24 Alpine عشان خفة الحجم والسرعة
FROM node:24-alpine

# تثبيت pnpm عالمياً لأنك بتستخدمه
RUN npm install -g pnpm

# تحديد مسار العمل
WORKDIR /usr/src/app

# نسخ ملفات الـ package وتثبيت الـ dependencies
# عملنا كدة قبل نسخ الكود عشان نستفيد من الـ Docker Cache
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# نسخ كل ملفات المشروع
COPY . .

# عمل Build للمشروع (بيحول الـ TS لـ JS في فولدر dist)
RUN pnpm run build

# فتح البورت اللي التطبيق شغال عليه
EXPOSE 3000

# تشغيل التطبيق من فولدر الـ dist
CMD ["node", "dist/main.js"]
CMD ["node", "dist/main.js"]