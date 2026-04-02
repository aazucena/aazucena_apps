import json
from typing import List, Dict, Any
from app.core.clickhouse import ch_core

class FiscalAuditor:
    def __init__(self):
        self.KEYWORDS = ["cost", "spend", "tokens", "savings", "budget", "fiscal", "expensive", "efficiency"]

    def is_relevant(self, query: str) -> bool:
        """Checks if the query is relevant to AI costs or token usage."""
        query_lower = query.lower()
        return any(kw in query_lower for kw in self.KEYWORDS)

    async def get_spend_summary(self) -> str:
        """Queries ClickHouse for a summary of AI spend and theoretical savings."""
        try:
            client = ch_core.get_analytics_client()
            # Query spend and savings for the last 7 days
            query = """
                SELECT 
                    sum(cost_usd) as total_spend,
                    sum(input_tokens + output_tokens) as total_tokens,
                    (sum(input_tokens + output_tokens) / 1000000) * 10.0 - sum(cost_usd) as total_savings
                FROM analytics.ai_intelligence
                WHERE timestamp >= subtractDays(now(), 7)
            """
            result = client.query(query)
            if not result.result_rows:
                return "No fiscal telemetry recorded in the last 7 days."
            
            row = result.result_rows[0]
            return (f"AI Fiscal Audit (7d):\n"
                    f"- Actual Spend: ${row[0]:.4f} USD\n"
                    f"- Total Tokens: {row[1]:,}\n"
                    f"- Local Execution Savings: ${row[2]:.4f} USD (Theoretical value vs GPT-4o)")
        except Exception as e:
            return f"Error fetching fiscal data: {str(e)}"

    async def discover_knowledge(self, query: str) -> str:
        """Returns fiscal insights."""
        print(f"💰 [Fiscal] Auditing resource consumption...")
        
        insights = "\n---\n[KNOWLEDGE_SOURCE]: Fiscal Auditor (Spend Intelligence)\n"
        insights += await self.get_spend_summary()
        insights += "\n---\n"
        return insights

# Global Instance
fiscal = FiscalAuditor()
