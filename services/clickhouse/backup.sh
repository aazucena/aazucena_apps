#!/bin/bash

# 💾 AZUCENA_LYTICS // ClickHouse Automated Backup Script
# Performs a full native backup of the 'analytics' database.

set -e

# Configuration
DB_NAME="analytics"
BACKUP_DIR="/var/lib/clickhouse/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DB_NAME}_${TIMESTAMP}"

echo "🚀 [Backup] Starting backup for database: ${DB_NAME}..."
echo "📂 [Backup] Target: ${BACKUP_DIR}/${BACKUP_NAME}"

# Execute native backup command via clickhouse-client
# We use 'admin' user to perform this operation.
docker exec -i aazucena-clickhouse clickhouse-client -u admin --password "${CLICKHOUSE_PASSWORD:-password}" -q \
"BACKUP DATABASE ${DB_NAME} TO File('${BACKUP_NAME}')"

echo "✅ [Backup] COMPLETED: ${BACKUP_NAME}"

# Retention: Keep only the last 7 backups locally
echo "🧹 [Backup] Cleaning up old backups (keeping last 7)..."
# List backups in the container's directory and delete oldest if count > 7
# (Note: This logic assumes backups are stored as individual files/folders in the mount)
docker exec -i aazucena-clickhouse bash -c "cd ${BACKUP_DIR} && ls -t | tail -n +8 | xargs rm -rf --"

echo "🏁 [Backup] Process finished."

