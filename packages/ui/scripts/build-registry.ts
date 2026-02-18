import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_COMPONENTS_DIR = path.resolve(__dirname, '../src/components/ui');
const OUTPUT_DIR = path.resolve(__dirname, '../registry');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface RegistryItem {
  name: string;
  type: 'registry:ui';
  dependencies: string[];
  registryDependencies: string[];
  files: {
    path: string;
    type: 'registry:ui';
  }[];
}

function getDependencies(content: string) {
  const dependencies = new Set<string>();
  const registryDependencies = new Set<string>();

  // Find all imports
  const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    if (importPath.startsWith('@radix-ui/')) {
      dependencies.add(importPath);
    } else if (
      importPath === 'cmdk' ||
      importPath === 'vaul' ||
      importPath === 'embla-carousel-react' ||
      importPath === 'input-otp'
    ) {
      dependencies.add(importPath);
    } else if (importPath.startsWith('@/components/ui/')) {
      // Internal dependency within the UI components
      const depName = importPath.replace('@/components/ui/', '').replace('.js', '');
      if (depName !== 'index') {
        registryDependencies.add(depName);
      }
    } else if (importPath.startsWith('./')) {
      // Relative import - assume it's another UI component if in the same dir
      const depName = importPath.replace('./', '').replace('.js', '');
      if (depName !== 'index') {
        registryDependencies.add(depName);
      }
    }
  }

  return {
    dependencies: Array.from(dependencies),
    registryDependencies: Array.from(registryDependencies),
  };
}

async function buildRegistry() {
  const files = fs.readdirSync(UI_COMPONENTS_DIR);
  const registryItems: RegistryItem[] = [];

  for (const file of files) {
    if (!file.endsWith('.tsx') || file === 'index.tsx') continue;

    const filePath = path.join(UI_COMPONENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const name = file.replace('.tsx', '');

    const { dependencies, registryDependencies } = getDependencies(content);

    const item: RegistryItem = {
      name,
      type: 'registry:ui',
      dependencies,
      registryDependencies,
      files: [
        {
          path: `components/ui/${file}`,
          type: 'registry:ui',
        },
      ],
    };

    registryItems.push(item);

    // Save individual component JSON
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
  }

  // Save index.json
  const index = {
    name: 'aazucena-ui',
    items: registryItems.map((item) => ({
      name: item.name,
      type: item.type,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
    })),
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(index, null, 2));

  console.log(`✅ Registry built with ${registryItems.length} components.`);
}

buildRegistry().catch(console.error);
