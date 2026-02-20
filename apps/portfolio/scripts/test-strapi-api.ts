/**
 * Strapi API Integration Test
 *
 * This script tests the Strapi API integration to ensure:
 * 1. Environment variables are configured correctly
 * 2. API token has proper permissions
 * 3. All endpoints are accessible
 * 4. Data is being returned correctly
 *
 * Usage:
 *   pnpm tsx scripts/test-strapi-api.ts
 */

import "dotenv/config";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, "green");
}

function logError(message: string) {
  log(`❌ ${message}`, "red");
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, "blue");
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, "yellow");
}

async function testEndpoint(
  name: string,
  endpoint: string,
  options?: { expectEmpty?: boolean },
): Promise<boolean> {
  try {
    const url = `${STRAPI_URL}/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      logError(`${name} - HTTP ${response.status}: ${response.statusText}`);
      return false;
    }

    const data = await response.json();

    if (data.data) {
      const recordCount = Array.isArray(data.data) ? data.data.length : 1;

      if (recordCount === 0 && !options?.expectEmpty) {
        logWarning(
          `${name} - No data found (this might be expected if you haven't populated content yet)`,
        );
      } else {
        logSuccess(`${name} - ${recordCount} record(s) found`);
      }

      return true;
    } else {
      logError(`${name} - Unexpected response format`);
      return false;
    }
  } catch (error) {
    logError(
      `${name} - ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return false;
  }
}

async function runTests() {
  log("\n" + "=".repeat(60), "cyan");
  log("  Strapi API Integration Test", "cyan");
  log("=".repeat(60) + "\n", "cyan");

  // Step 1: Check environment variables
  log("Step 1: Checking Environment Variables\n", "cyan");

  if (!STRAPI_URL) {
    logError("STRAPI_URL is not defined");
    process.exit(1);
  }
  logSuccess(`STRAPI_URL: ${STRAPI_URL}`);

  if (!STRAPI_TOKEN) {
    logError("STRAPI_TOKEN is not defined");
    logInfo("Please add your Build/SSR token to apps/portfolio/.env");
    process.exit(1);
  }
  logSuccess(`STRAPI_TOKEN: ${STRAPI_TOKEN.substring(0, 10)}...`);

  // Step 2: Test Strapi health
  log("\nStep 2: Testing Strapi Health\n", "cyan");

  try {
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (healthCheck.ok) {
      logSuccess("Strapi is running");
    } else {
      logError("Strapi health check failed");
      logInfo("Make sure Strapi is running: docker compose up -d");
      process.exit(1);
    }
  } catch {
    logError(`Cannot connect to Strapi at ${STRAPI_URL}`);
    logInfo("Make sure Strapi is running: docker compose up -d");
    process.exit(1);
  }

  // Step 3: Test Single Types
  log("\nStep 3: Testing Single Types\n", "cyan");

  const singleTypes = [
    { name: "Hero", endpoint: "hero" },
    { name: "About", endpoint: "about" },
    { name: "Portfolio", endpoint: "portfolio" },
    { name: "Website Configuration", endpoint: "website-configuration" },
    { name: "Theme", endpoint: "theme" },
    { name: "Homepage", endpoint: "homepage" },
    { name: "Animation System", endpoint: "animation" },
    { name: "Maintenance", endpoint: "maintenance" },
    { name: "Analytics", endpoint: "analytic" },
    { name: "Blog Configuration", endpoint: "blog" },
  ];

  const singleTypeResults = [];
  for (const type of singleTypes) {
    const result = await testEndpoint(type.name, type.endpoint);
    singleTypeResults.push(result);
  }

  // Step 4: Test Collection Types
  log("\nStep 4: Testing Collection Types\n", "cyan");

  const collectionTypes = [
    { name: "Skills", endpoint: "skills" },
    { name: "Music Genres", endpoint: "music-genres" },
    { name: "Posts", endpoint: "posts" },
    { name: "Projects", endpoint: "projects" },
    { name: "Experience", endpoint: "experiences" },
    { name: "Testimonials", endpoint: "testimonials" },
    { name: "Awards", endpoint: "awards" },
    { name: "Compositions", endpoint: "compositions" },
    {
      name: "Form Submissions",
      endpoint: "form-submissions",
      expectEmpty: true,
    },
    {
      name: "Easter Egg Completions",
      endpoint: "easter-egg-completions",
      expectEmpty: true,
    },
  ];

  const collectionTypeResults = [];
  for (const type of collectionTypes) {
    const result = await testEndpoint(type.name, type.endpoint, {
      expectEmpty: type.expectEmpty,
    });
    collectionTypeResults.push(result);
  }

  // Step 5: Test populated queries
  log("\nStep 5: Testing Populated Queries\n", "cyan");

  const populatedResult = await testEndpoint(
    "Hero (with populate)",
    "hero?populate=*",
  );

  // Summary
  log("\n" + "=".repeat(60), "cyan");
  log("  Test Summary", "cyan");
  log("=".repeat(60) + "\n", "cyan");

  const totalTests =
    singleTypeResults.length + collectionTypeResults.length + 1;
  const passedTests = [
    ...singleTypeResults,
    ...collectionTypeResults,
    populatedResult,
  ].filter((r) => r).length;

  log(`Total Tests: ${totalTests}`, "cyan");
  log(`Passed: ${passedTests}`, "green");
  log(`Failed: ${totalTests - passedTests}`, "red");

  if (passedTests === totalTests) {
    log(
      "\n🎉 All tests passed! Your Strapi API integration is working correctly.\n",
      "green",
    );
    logInfo("Next steps:");
    logInfo("1. Populate content in Strapi admin: http://localhost:1337/admin");
    logInfo("2. Update your Astro pages to fetch data from CMS");
    logInfo("3. See docs/strapi/17-frontend-integration-guide.md for examples");
  } else {
    log("\n⚠️  Some tests failed. Please review the errors above.\n", "yellow");
    logInfo("Common issues:");
    logInfo("1. Strapi not running → docker compose up -d");
    logInfo("2. Invalid token → Check STRAPI_TOKEN in .env");
    logInfo(
      "3. Missing permissions → Verify token permissions in Strapi admin",
    );
  }

  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests().catch((error) => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
});
