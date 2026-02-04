import os
from typing import List, Dict, Any

class CodebaseAuditor:
    def __init__(self):
        self.KEYWORDS = ["codebase", "folder", "directory", "file", "monorepo structure", "source code", "apps", "packages"]
        # Base path inside container for documentation
        self.DOCS_PATH = "/app/data/docs"
        # The service's own source code is also available
        self.SRC_PATH = "/app"

    def is_relevant(self, query: str) -> bool:
        """Checks if the query is asking about the codebase or file structure."""
        query_lower = query.lower()
        return any(kw in query_lower for kw in self.KEYWORDS)

    def _get_tree(self, path: str, max_depth: int = 2) -> str:
        """Simple recursive directory tree generator."""
        if not os.path.exists(path):
            return f"Path {path} not found."
        
        tree = ""
        prefix = "  "
        try:
            for root, dirs, files in os.walk(path):
                level = root.replace(path, '').count(os.sep)
                if level >= max_depth:
                    continue
                indent = prefix * level
                tree += f"{indent}📁 {os.path.basename(root)}/\n"
                sub_indent = prefix * (level + 1)
                for f in files[:5]: # Limit files to prevent token explosion
                    tree += f"{sub_indent}📄 {f}\n"
                if len(files) > 5:
                    tree += f"{sub_indent}... ({len(files)-5} more files)\n"
        except Exception as e:
            tree += f"Error listing {path}: {str(e)}"
        
        return tree

    async def discover_knowledge(self, query: str) -> str:
        """Returns a real-time audit of the accessible file system structure."""
        print(f"🔍 [Auditor] Auditing codebase structure...")
        
        shades = "\n---\n[KNOWLEDGE_SOURCE]: Codebase Auditor (Real-time File System)\n"
        
        shades += "**[PROJECT_DOCUMENTATION_BASE]**:\n"
        shades += self._get_tree(self.DOCS_PATH)
        
        shades += "\n**[INTELLIGENCE_CORE_SOURCE]**:\n"
        shades += self._get_tree(self.SRC_PATH)
        
        shades += "\n**[MONOREPO_CONTEXT]**:\n"
        shades += "Note: The current environment has read-only access to '/docs' and full access to 'intel-engine' source.\n"
        shades += "---\n"
        
        return shades

# Global Instance
auditor = CodebaseAuditor()
