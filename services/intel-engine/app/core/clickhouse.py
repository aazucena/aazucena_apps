import os
import clickhouse_connect
from typing import Optional

class ClickHouseCore:
    def __init__(self):
        # 1. Main Analytics ClickHouse
        self.analytics_host = os.getenv("CLICKHOUSE_HOST", "aazucena-clickhouse")
        self.analytics_user = os.getenv("CLICKHOUSE_USER", "admin")
        self.analytics_pass = os.getenv("CLICKHOUSE_PASSWORD", "clickhouse")
        self.analytics_db = os.getenv("CLICKHOUSE_DB", "analytics")

    def get_analytics_client(self):
        """Returns a client for the main analytics database."""
        return clickhouse_connect.get_client(
            host=self.analytics_host,
            username=self.analytics_user,
            password=self.analytics_pass,
            database=self.analytics_db,
            port=8123
        )

# Global Instance
ch_core = ClickHouseCore()
