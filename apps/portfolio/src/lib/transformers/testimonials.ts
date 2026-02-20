import type { StrapiTestimonial } from "~/lib/validators/testimonials";
import type { Testimonial } from "~/components/ui/infinite-moving-cards";

/**
 * Generate avatar initials from name
 */
function getAvatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate gradient based on name (deterministic)
 * Always returns a valid gradient string
 */
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-cyan-400 to-blue-500",
    "from-purple-400 to-pink-500",
    "from-green-400 to-emerald-500",
    "from-orange-400 to-red-500",
    "from-blue-400 to-indigo-500",
    "from-yellow-400 to-orange-500",
  ];

  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length] ?? gradients[0]!;
}

/**
 * Transform Strapi testimonial to frontend format
 */
export function transformTestimonial(
  strapiTest: StrapiTestimonial,
): Testimonial {
  return {
    quote: strapiTest.content,
    name: strapiTest.author,
    title: strapiTest.authorTitle || strapiTest.company || "Client",
    avatar: getAvatarInitials(strapiTest.author),
    gradient: getAvatarGradient(strapiTest.author),
  };
}

/**
 * Transform array of testimonials
 * Filters approved only
 */
export function transformTestimonials(
  strapiTests: StrapiTestimonial[],
  featuredOnly: boolean = false,
): Testimonial[] {
  const filtered = strapiTests.filter((test) => {
    // Only show approved testimonials
    if (test.approvalStatus !== "Approved") return false;
    // Filter by featured if requested
    if (featuredOnly && !test.featured) return false;
    return true;
  });

  return filtered.map(transformTestimonial);
}

/**
 * Default fallback testimonials
 */
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Aldrin consistently delivers high-quality code and demonstrates exceptional problem-solving skills.",
    name: "John Doe",
    title: "Senior Engineering Manager",
    avatar: "JD",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    quote:
      "Working with Aldrin has been a pleasure. He translates complex requirements into elegant solutions.",
    name: "Sarah Miller",
    title: "Product Manager",
    avatar: "SM",
    gradient: "from-purple-400 to-pink-500",
  },
];
