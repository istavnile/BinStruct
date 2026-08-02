#!/bin/sh
set -e

echo "▶ DATABASE_URL set: ${DATABASE_URL:+yes}"
echo "▶ Running database migrations…"
node node_modules/prisma/build/index.js migrate deploy

echo "▶ Starting BinStruct…"
exec node server.js
