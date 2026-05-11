#!/usr/bin/env node
// @ts-check

/**
 * Unified Seed Script Runner
 *
 * Automatically discovers and runs seed scripts
 *
 * Usage:
 *   node scripts/seed.js                    # Interactive menu
 *   node scripts/seed.js all                # Run all seed scripts
 *   node scripts/seed.js skills experiences # Run specific seeds
 *   node scripts/seed.js --list             # List available seeds
 *
 * No need to add individual scripts to package.json!
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SCRIPTS_DIR = __dirname;

/**
 * @typedef {Object} SeedScript
 * @property {string} name - Name of the seed script
 * @property {string} file - Full path to the seed script file
 */

/**
 * @typedef {Object} SeedResult
 * @property {boolean} success - Whether the seed script succeeded
 * @property {string} name - Name of the seed script
 * @property {Error} [error] - Error object if failed
 */

/**
 * Discover all seed-*.js scripts in the scripts directory
 * @returns {SeedScript[]} Array of seed script metadata
 */
function discoverSeedScripts() {
  const files = fs.readdirSync(SCRIPTS_DIR);
  const seedScripts = files
    .filter((file) => file.startsWith('seed-') && file.endsWith('.js'))
    .map((file) => {
      const name = file.replace('seed-', '').replace('.js', '');
      return { name, file: path.join(SCRIPTS_DIR, file) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return seedScripts;
}

/**
 * Run a single seed script
 * @param {string} scriptPath - Full path to the seed script
 * @param {string} scriptName - Name of the seed script
 * @returns {Promise<SeedResult>} Result of the seed operation
 */
async function runSeedScript(scriptPath, scriptName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌱 Running: ${scriptName}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    /** @type {() => Promise<void>} */
    const seedFunction = require(scriptPath);
    await seedFunction();
    return { success: true, name: scriptName };
  } catch (error) {
    console.error(`\n❌ Failed: ${scriptName}`);
    if (error instanceof Error) {
      console.error(error.message);
    }
    return {
      success: false,
      name: scriptName,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Show interactive menu for selecting seed scripts
 * @param {SeedScript[]} seedScripts - Available seed scripts
 * @returns {Promise<string>} Selected script name or 'all'
 */
async function showInteractiveMenu(seedScripts) {
  console.log('\n🌱 Available Seed Scripts:\n');
  seedScripts.forEach((script, index) => {
    console.log(`  ${index + 1}. ${script.name}`);
  });
  console.log(`  ${seedScripts.length + 1}. Run all`);
  console.log('  0. Exit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Select option (number): ', (answer) => {
      rl.close();
      const choice = parseInt(answer, 10);

      if (choice === 0) {
        console.log('👋 Exiting...');
        process.exit(0);
      } else if (choice === seedScripts.length + 1) {
        resolve('all');
      } else if (choice > 0 && choice <= seedScripts.length) {
        resolve(seedScripts[choice - 1].name);
      } else {
        console.error('❌ Invalid choice');
        process.exit(1);
      }
    });
  });
}

/**
 * Main execution function
 * @returns {Promise<void>}
 */
async function main() {
  const args = process.argv.slice(2);
  const seedScripts = discoverSeedScripts();

  if (seedScripts.length === 0) {
    console.error('❌ No seed scripts found in scripts/ directory');
    console.error('   Seed scripts should be named: seed-*.js');
    process.exit(1);
  }

  // List mode
  if (args.includes('--list') || args.includes('-l')) {
    console.log('\n📋 Available seed scripts:\n');
    seedScripts.forEach((script) => {
      console.log(`  • ${script.name}`);
    });
    console.log(`\n📝 Usage:`);
    console.log(`   node scripts/seed.js all              # Run all seeds`);
    console.log(`   node scripts/seed.js skills projects  # Run specific seeds`);
    console.log(`   node scripts/seed.js                  # Interactive menu\n`);
    process.exit(0);
  }

  /** @type {SeedScript[]} */
  let scriptsToRun = [];

  // Interactive mode (no arguments)
  if (args.length === 0) {
    const choice = await showInteractiveMenu(seedScripts);
    if (choice === 'all') {
      scriptsToRun = seedScripts;
    } else {
      scriptsToRun = seedScripts.filter((s) => s.name === choice);
    }
  }
  // Run all
  else if (args.includes('all')) {
    scriptsToRun = seedScripts;
  }
  // Run specific scripts
  else {
    scriptsToRun = seedScripts.filter((s) => args.includes(s.name));

    // Check for invalid script names
    const validNames = seedScripts.map((s) => s.name);
    const invalidNames = args.filter((arg) => !validNames.includes(arg) && arg !== 'all');
    if (invalidNames.length > 0) {
      console.error(`❌ Unknown seed script(s): ${invalidNames.join(', ')}`);
      console.error(`\n📋 Available: ${validNames.join(', ')}`);
      console.error(`\nRun with --list to see all available seeds`);
      process.exit(1);
    }
  }

  if (scriptsToRun.length === 0) {
    console.error('❌ No seed scripts to run');
    process.exit(1);
  }

  // Execute seeds
  console.log(`\n🚀 Running ${scriptsToRun.length} seed script(s)...\n`);

  /** @type {SeedResult[]} */
  const results = [];
  for (const script of scriptsToRun) {
    const result = await runSeedScript(script.file, script.name);
    results.push(result);
  }

  // Summary
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('📊 Seeding Summary');
  console.log(`${'='.repeat(60)}\n`);

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach((r) => console.log(`   • ${r.name}`));

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach((r) => console.log(`   • ${r.name}`));
    console.log('');
    process.exit(1);
  }

  console.log('\n✅ All seeds completed successfully!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
