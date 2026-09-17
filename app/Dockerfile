FROM node:20-bookworm

WORKDIR /workspace

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    CI=true \
    ELECTRON_CACHE=/root/.cache/electron \
    ELECTRON_BUILDER_CACHE=/root/.cache/electron-builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

CMD ["pnpm", "install", "--frozen-lockfile", "--offline"]