import os
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
_CONFIGURED_KEY = os.getenv("INTEL_ENGINE_API_KEY", "")


async def verify_api_key(api_key: str = Security(_api_key_header)) -> None:
    """Rejects requests with a missing or wrong X-API-Key header.
    If INTEL_ENGINE_API_KEY is not set, all requests pass (dev mode).
    """
    if not _CONFIGURED_KEY:
        return
    if api_key != _CONFIGURED_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
