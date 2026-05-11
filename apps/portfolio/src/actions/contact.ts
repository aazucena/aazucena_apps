import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createStrapiEntry } from "@aazucena/api";

const contact = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  }),
  handler: async ({ name, email, subject, message }) => {
    const result = await createStrapiEntry("form-submissions", {
      formType: "Contact",
      rawMessage: `Subject: ${subject}\n\n${message}`,
      formData: { name, subject, message },
      submitterEmail: email,
      submitterName: name,
      submittedAt: new Date().toISOString(),
      status: "New",
    });
    return { success: true, result };
  },
});

export default contact;
