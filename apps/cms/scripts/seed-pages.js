// @ts-check

/**
 * Strapi v5 Seeding Script for Legal Pages
 *
 * Seeds Privacy Policy, Terms of Service, and Contact pages
 * Run via unified seed runner: node scripts/seed.js pages
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const pagesData = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    template: 'legal',
    lastUpdated: new Date().toISOString().split('T')[0],
    showTableOfContents: true,
    footerVariant: 'minimal',
    content: `## 1. Overview

Your privacy is critically important to me. This Privacy Policy outlines how I handle personal data collected through this portfolio website (aazucena.com). My goal is to be transparent about what is collected and how it is used to provide you with a secure and professional experience.

## 2. Data Collection

I collect limited information to facilitate communication and understand site performance:

- **Contact Form Data:** When you reach out via the contact form, I collect your name, email address, and any message content you provide. This information is used solely to respond to your inquiries.
- **Analytics & Usage:** I use privacy-conscious analytics tools (like Vercel Analytics and Sentry) to collect non-identifying information such as browser type, page views, and error logs. This helps me maintain site stability and performance.
- **Cookies:** This site uses minimal essential cookies required for basic functionality and performance monitoring.

## 3. Third-Party Services

To provide a high-performance experience, I utilize several trusted industry partners:

- **Vercel:** Hosting and performance analytics.
- **Railway:** Backend infrastructure and database hosting.
- **Strapi:** Content management and data storage.
- **Cloudinary:** Secure media storage and optimization.
- **Google reCAPTCHA:** To prevent spam and ensure secure form submissions.

Each of these services maintains its own privacy policy regarding the data they process on my behalf.

## 4. Data Security & Retention

I implement industry-standard security measures to protect your data. Personal information collected through contact forms is retained only as long as necessary to fulfill the purpose of the communication or as required by law. I do not sell, trade, or otherwise transfer your personal information to outside parties.

## 5. Your Rights

Depending on your jurisdiction (including GDPR and CCPA), you may have rights to access, correct, or delete your personal data. If you have any requests regarding your information, please contact me directly.

## 6. Policy Updates

This policy may be updated to reflect changes in site functionality or legal requirements. The "Last Updated" date at the top of this page will always indicate the most recent version.

## 7. Contact Information

For any privacy-related questions, please reach out via the contact form or directly at **contact@aazucena.com**.`,
    seo: {
      metaTitle: 'Privacy Policy | Aldrin Azucena',
      metaDescription:
        "Detailed information on how personal data and privacy are handled on Aldrin Azucena's professional portfolio.",
      keywords:
        'privacy policy, data protection, personal information, data security, gdpr, engineering portfolio',
    },
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    template: 'legal',
    lastUpdated: new Date().toISOString().split('T')[0],
    showTableOfContents: true,
    footerVariant: 'minimal',
    content: `## 1. Acceptance of Terms

By accessing or using aazucena.com, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using this website.

## 2. Intellectual Property

Unless otherwise stated, all materials on this website—including code, design, text, animations, and graphics—are the intellectual property of **Aldrin Azucena**.

- **Code Snippets:** Code explicitly shared for educational purposes may be used according to the license specified in the relevant repository.
- **Creative Assets:** Graphics, logos, and custom animations may not be reproduced or used without prior written consent.

## 3. Permitted Use

You are granted a limited, non-exclusive license to view and interact with the materials on this website for personal, non-commercial, and informational purposes. 

You may **not**:
- Use the site for any unlawful purpose.
- Attempt to decompile, reverse engineer, or bypass security features.
- Use automated systems (bots, scrapers) to extract data without permission.

## 4. Disclaimers

The materials on this website are provided on an "as is" basis. While I strive for accuracy, I make no warranties, expressed or implied, regarding the completeness or reliability of the information shared.

Technical tutorials and code examples are provided for informational purposes. Implementing them in production environments is done at your own risk.

## 5. Limitation of Liability

In no event shall Aldrin Azucena be liable for any damages (including loss of data, profit, or business interruption) arising out of the use or inability to use the materials on this site, even if advised of the possibility of such damage.

## 6. External Links

This website contains links to third-party sites (e.g., GitHub, LinkedIn, external blogs). I am not responsible for the content or privacy practices of these external platforms.

## 7. Governing Law

These terms are governed by and construed in accordance with the laws of Canada, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

## 8. Modifications

I reserve the right to revise these terms at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.`,
    seo: {
      metaTitle: 'Terms of Service | Aldrin Azucena',
      metaDescription:
        'Standard terms and conditions for using the professional portfolio and technical resources of Aldrin Azucena.',
      keywords:
        'terms of service, legal, intellectual property, code license, engineering portfolio',
    },
  },
];

async function seedPages() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Refined Legal Pages...\n');

    let created = 0;
    let existing = 0;
    let updated = 0;

    for (const page of pagesData) {
      const existingPage = await strapi.db
        .query('api::page.page')
        .findOne({ where: { slug: page.slug } });

      if (existingPage) {
        await strapi.entityService.update('api::page.page', existingPage.id, {
          data: page,
        });
        console.log(`🔄 Updated: ${page.title} (/${page.slug})`);
        updated++;
        continue;
      }

      await strapi.entityService.create('api::page.page', {
        data: page,
      });

      console.log(`✅ Created: ${page.title} (/${page.slug})`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total: ${pagesData.length}`);
    console.log('\n✅ Legal pages seeding complete');
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

module.exports = seedPages;
