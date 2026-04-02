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
        
        # 2. Plausible ClickHouse
        self.plausible_host = os.getenv("PLAUSIBLE_CLICKHOUSE_HOST", "aazucena-plausible-clickhouse")
        self.plausible_user = os.getenv("PLAUSIBLE_CLICKHOUSE_USER", "admin")
        self.plausible_pass = os.getenv("PLAUSIBLE_CLICKHOUSE_PASSWORD", "clickhouse")
        self.plausible_db = "plausible_events_db"

    def get_analytics_client(self):
        """Returns a client for the main analytics database."""
        return clickhouse_connect.get_client(
            host=self.analytics_host,
            username=self.analytics_user,
            password=self.analytics_pass,
            database=self.analytics_db,
            port=8123
        )

    def get_plausible_client(self):
        """Returns a client for the Plausible events database."""
        return clickhouse_connect.get_client(
            host=self.plausible_host,
            username=self.plausible_user,
            password=self.plausible_pass,
            database=self.plausible_db,
            port=8123
        )

# Global Instance
ch_core = ClickHouseCore()
