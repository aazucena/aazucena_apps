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
    content: `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## 1. Introduction

Welcome to Aldrin Azucena's portfolio website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## 2. Information We Collect

We may collect information about you in a variety of ways. The information we may collect on the website includes:

- **Personal Data:** Name, email address, and contact information you voluntarily provide through contact forms.
- **Usage Data:** Information about how you access and use the website, including IP address, browser type, pages visited, and time spent on pages.
- **Cookies and Tracking Technologies:** We may use cookies, web beacons, and similar tracking technologies to collect information.

## 3. How We Use Your Information

We use the information we collect to:

- Respond to your inquiries and provide customer support
- Improve and optimize our website and services
- Analyze usage patterns and trends
- Send periodic emails regarding updates or services (with your consent)

## 4. Data Security

We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

## 5. Third-Party Services

We may use third-party services for analytics (such as Vercel Analytics, Sentry) and hosting. These third parties have their own privacy policies governing the use of your information.

## 6. Your Rights

Depending on your location, you may have certain rights regarding your personal information, including:

- The right to access your personal data
- The right to rectify inaccurate data
- The right to request deletion of your data
- The right to object to or restrict processing

## 7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy.

## 8. Contact Us

If you have questions or concerns about this Privacy Policy, please contact us through the contact form on this website.`,
    seo: {
      metaTitle: 'Privacy Policy - Aldrin Azucena',
      metaDescription:
        'Learn how we collect, use, and protect your personal information when you visit our portfolio website.',
      keywords: 'privacy policy, data protection, personal information, data security, GDPR',
    },
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    template: 'legal',
    lastUpdated: new Date().toISOString().split('T')[0],
    showTableOfContents: true,
    footerVariant: 'minimal',
    content: `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## 1. Acceptance of Terms

By accessing and using this portfolio website, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License

Permission is granted to temporarily view and navigate the materials (information or software) on this website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials without permission
- Use the materials for any commercial purpose or public display
- Attempt to reverse engineer any software contained on the website
- Remove any copyright or proprietary notations from the materials

## 3. Intellectual Property

All content on this website, including but not limited to text, graphics, logos, images, code, and software, is the property of Aldrin Azucena and is protected by international copyright laws.

## 4. Disclaimer

The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 5. Limitations

In no event shall Aldrin Azucena or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.

## 6. Links to Third-Party Sites

This website may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.

## 7. Revisions and Errata

The materials appearing on this website may include technical, typographical, or photographic errors. We do not warrant that any of the materials on this website are accurate, complete, or current.

## 8. Modifications

We may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms.

## 9. Governing Law

These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

## 10. Contact Information

If you have any questions about these Terms of Service, please contact us through the contact form on this website.`,
    seo: {
      metaTitle: 'Terms of Service - Aldrin Azucena',
      metaDescription:
        'Terms and conditions for using Aldrin Azucena\'s portfolio website, including use license, disclaimers, and limitations.',
      keywords: 'terms of service, terms and conditions, legal, use license, disclaimer',
    },
  },
  {
    slug: 'contact',
    title: 'Get in Touch',
    template: 'default',
    lastUpdated: new Date().toISOString().split('T')[0],
    showTableOfContents: false,
    footerVariant: 'default',
    content: `## Let's Connect

I'm always interested in hearing about new opportunities, collaborations, and interesting projects. Whether you have a question, want to discuss a project, or just want to say hello, feel free to reach out!

### What I Can Help With

- Full-stack web development (Astro, React, TypeScript)
- Headless CMS integration (Strapi, PostgreSQL)
- Advanced animations and 3D web experiences (GSAP, Three.js, PixiJS)
- AI/ML integration (LangChain, LangGraph, Claude API)
- Mobile app development (Flutter, React Native)
- Music technology and interactive audio experiences

### Response Time

I typically respond to inquiries within 1-2 business days. For urgent matters, please mention that in your message.

You can also find me on the social platforms listed in the footer of this website.`,
    seo: {
      metaTitle: 'Contact - Aldrin Azucena',
      metaDescription:
        'Get in touch with Aldrin Azucena for full-stack development, AI/ML integration, music technology, or collaboration opportunities.',
      keywords:
        'contact, hire developer, full-stack developer, web development, collaboration, freelance',
    },
  },
];

async function seedPages() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Legal Pages...\n');

    let created = 0;
    let existing = 0;
    let updated = 0;

    for (const page of pagesData) {
      // Check if page already exists
      const existingPage = await strapi.db
        .query('api::page.page')
        .findOne({ where: { slug: page.slug } });

      if (existingPage) {
        // Update if lastUpdated is older
        const existingDate = new Date(existingPage.lastUpdated);
        const newDate = new Date(page.lastUpdated);

        if (newDate > existingDate || !existingPage.content) {
          await strapi.entityService.update('api::page.page', existingPage.id, {
            data: page,
          });
          console.log(`🔄 Updated: ${page.title} (/${page.slug})`);
          updated++;
        } else {
          console.log(`✓ Exists: ${page.title} (/${page.slug})`);
          existing++;
        }
        continue;
      }

      // Create new page
      await strapi.entityService.create('api::page.page', {
        data: page,
      });

      console.log(`✅ Created: ${page.title} (/${page.slug})`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Existing (unchanged): ${existing}`);
    console.log(`   Total: ${pagesData.length}`);
    console.log('\n✅ Legal pages seeding complete');
    console.log('\n📝 Pages accessible at:');
    pagesData.forEach((page) => {
      console.log(`   - https://aazucena.com/${page.slug}`);
    });
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
    // Log full validation error details
    // @ts-ignore
    if (error.details && error.details.errors) {
      console.error('\n📋 Validation Error Details:');
      // @ts-ignore
      error.details.errors.forEach((err, index) => {
        console.error(`  Error ${index + 1}:`, JSON.stringify(err, null, 2));
      });
    }
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Export for unified seed runner
module.exports = seedPages;
