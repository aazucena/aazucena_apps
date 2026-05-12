FROM clickhouse/clickhouse-server:24.12-alpine

# Custom logging and low-resource configs
COPY logs.xml /etc/clickhouse-server/config.d/logs.xml
COPY low-resources.xml /etc/clickhouse-server/config.d/low-resources.xml

# User profile and RBAC
COPY default-profile-low-resources-overrides.xml /etc/clickhouse-server/users.d/default-profile-low-resources-overrides.xml
COPY admin-rbac.xml /etc/clickhouse-server/users.d/admin-rbac.xml

# Init SQL scripts — run automatically on first boot
COPY scripts/ /docker-entrypoint-initdb.d/

# ipv4-only.xml intentionally excluded — Docker bridge workaround, not needed on Railway
