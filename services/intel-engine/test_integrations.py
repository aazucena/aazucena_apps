import os
import sys

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not VOYAGE_API_KEY or not ANTHROPIC_API_KEY:
    print("❌ Missing env vars. Run with:")
    print("   VOYAGE_API_KEY=... ANTHROPIC_API_KEY=... python3 test_integrations.py")
    sys.exit(1)

# --- Test 1: Voyage AI embeddings ---
print("1. Testing Voyage AI (voyage-3)...")
import voyageai
vo = voyageai.Client()
result = vo.embed(["Intel Engine integration test"], model="voyage-3", input_type="document")
embedding = result.embeddings[0]
assert len(embedding) == 1024, f"Expected 1024 dims, got {len(embedding)}"
print(f"   ✅ Embedding OK — dimension: {len(embedding)}")

# --- Test 2: Claude Haiku ---
print("2. Testing Claude (claude-haiku-4-5-20251001)...")
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
llm = ChatAnthropic(model="claude-haiku-4-5-20251001", max_tokens=32)
res = llm.invoke([HumanMessage(content="Reply with only the word: READY")])
print(f"   ✅ LLM OK — response: {res.content.strip()}")

print("\n✅ All integrations passed. Safe to deploy.")
