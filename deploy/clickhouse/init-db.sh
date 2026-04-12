#!/bin/bash
set -e

# Wait for ClickHouse to be ready
until clickhouse-client --query "SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for ClickHouse..."
    sleep 1
done

echo "Applying analytics schema..."
clickhouse-client --multiquery < /docker-entrypoint-initdb.d/schema.sql
echo "Schema applied successfully."
