FROM node:20-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN pnpm install

# 复制 wrangler.example.json 到 wrangler.json
RUN cp wrangler.example.json wrangler.json

# 构建项目
RUN pnpm run pages:build

# 暴露端口
EXPOSE 8788

# 设置环境变量
ENV AUTH_SECRET=""
ENV AUTH_GITHUB_ID=""
ENV AUTH_GITHUB_SECRET=""

# 创建启动脚本
RUN echo '#!/bin/sh\n\
# 初始化或者更新数据库\n\
pnpm run db:migrate-local\n\
# 确保目录权限正确\n\
chmod -R 777 .wrangler\n\
# 启动应用\n\
pnpm wrangler pages dev .vercel/output/static --compatibility-flag nodejs_compat\n\
' > /app/start.sh && chmod +x /app/start.sh

# 定义卷
VOLUME ["/app/.wrangler"]

# 设置启动命令
CMD ["/app/start.sh"]