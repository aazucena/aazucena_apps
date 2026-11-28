import asyncio
from types import SimpleNamespace

import app.services.sage as sage_module
from app.services.sage import Sage


class FakeClient:
    def __init__(self, rows):
        self.rows = rows
        self.queries = []

    def query(self, sql):
        self.queries.append(sql)
        return SimpleNamespace(result_rows=self.rows)


def run_summary(monkeypatch, rows):
    client = FakeClient(rows)
    monkeypatch.setattr(sage_module.ch_core, "get_analytics_client", lambda: client)
    return asyncio.run(Sage().get_traffic_summary()), client


def test_traffic_summary_reads_first_party_telemetry(monkeypatch):
    summary, client = run_summary(monkeypatch, [(12, 40)])
    assert summary == "Traffic (24h): 12 visits, 40 page views."
    sql = client.queries[0]
    assert "analytics.telemetry_events" in sql
    assert "event = 'PageView'" in sql
    assert "plausible" not in sql.lower()


def test_traffic_summary_with_no_page_views(monkeypatch):
    summary, _ = run_summary(monkeypatch, [(0, 0)])
    assert summary == "No traffic data recorded in the last 24 hours."
