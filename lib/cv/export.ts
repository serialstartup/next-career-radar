// CV Export Utilities
// This module provides functions to export CVs in various formats

export interface CVData {
  basics: {
    name: string;
    email: string;
    phone?: string;
    title?: string;
    summary?: string;
    location?: string;
    url?: string;
  };
  experience: Array<{
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    gpa?: number;
  }>;
  skills: Array<{
    name: string;
    level?: string;
    yearsOfExperience?: number;
  }>;
}

/**
 * Export CV as JSON
 */
export function exportToJSON(cvData: CVData): string {
  return JSON.stringify(cvData, null, 2);
}

/**
 * Download CV as JSON file
 */
export function downloadJSON(cvData: CVData, filename: string = "cv.json"): void {
  const json = exportToJSON(cvData);
  downloadFile(json, filename, "application/json");
}

/**
 * Export CV as plain text (ATS-friendly)
 */
export function exportToText(cvData: CVData): string {
  const lines: string[] = [];

  // Header
  if (cvData.basics.name) {
    lines.push(cvData.basics.name.toUpperCase());
    lines.push("=".repeat(cvData.basics.name.length));
    lines.push("");
  }

  // Contact Info
  const contactInfo: string[] = [];
  if (cvData.basics.email) contactInfo.push(cvData.basics.email);
  if (cvData.basics.phone) contactInfo.push(cvData.basics.phone);
  if (cvData.basics.location) contactInfo.push(cvData.basics.location);
  if (cvData.basics.url) contactInfo.push(cvData.basics.url);

  if (contactInfo.length > 0) {
    lines.push(contactInfo.join(" | "));
    lines.push("");
  }

  // Summary
  if (cvData.basics.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push(cvData.basics.summary);
    lines.push("");
  }

  // Experience
  if (cvData.experience.length > 0) {
    lines.push("WORK EXPERIENCE");
    lines.push("");
    cvData.experience.forEach((exp) => {
      const dateRange = exp.startDate && exp.endDate
        ? `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}`
        : "";
      lines.push(`${exp.title} at ${exp.company}`);
      if (dateRange) lines.push(dateRange);
      if (exp.description) lines.push(exp.description);
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          lines.push(`• ${achievement}`);
        });
      }
      lines.push("");
    });
  }

  // Education
  if (cvData.education.length > 0) {
    lines.push("EDUCATION");
    lines.push("");
    cvData.education.forEach((edu) => {
      const dateRange = edu.startDate && edu.endDate
        ? `${edu.startDate} - ${edu.endDate}`
        : "";
      lines.push(`${edu.degree} in ${edu.fieldOfStudy}`);
      lines.push(edu.institution);
      if (dateRange) lines.push(dateRange);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      lines.push("");
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    lines.push("SKILLS");
    const skillsText = cvData.skills
      .map((s) => `${s.name}${s.level ? ` (${s.level})` : ""}`)
      .join(", ");
    lines.push(skillsText);
  }

  return lines.join("\n");
}

/**
 * Download CV as plain text file (ATS-friendly)
 */
export function downloadText(cvData: CVData, filename: string = "cv.txt"): void {
  const text = exportToText(cvData);
  downloadFile(text, filename, "text/plain");
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format CV for HTML/React rendering (for PDF generation)
 */
export function formatCVForPDF(cvData: CVData): string {
  // This is a simple HTML format - for production, use a proper PDF library
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .contact { color: #666; margin-bottom: 20px; }
        .experience-item { margin-bottom: 20px; }
        .company { font-weight: bold; }
        .date { color: #888; font-size: 0.9em; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #f0f0f0; padding: 4px 12px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>${cvData.basics.name || "Your Name"}</h1>
      <div class="contact">
        ${cvData.basics.email}${cvData.basics.phone ? ` | ${cvData.basics.phone}` : ""}
        ${cvData.basics.location ? ` | ${cvData.basics.location}` : ""}
      </div>

      ${cvData.basics.summary ? `<p>${cvData.basics.summary}</p>` : ""}

      <h2>Experience</h2>
      ${cvData.experience
        .map(
          (exp) => `
        <div class="experience-item">
          <div class="company">${exp.title} at ${exp.company}</div>
          <div class="date">${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}</div>
          ${exp.description ? `<p>${exp.description}</p>` : ""}
        </div>
      `
        )
        .join("")}

      <h2>Education</h2>
      ${cvData.education
        .map(
          (edu) => `
        <div>
          <div class="company">${edu.degree} in ${edu.fieldOfStudy}</div>
          <div class="date">${edu.institution} | ${edu.startDate} - ${edu.endDate}</div>
        </div>
      `
        )
        .join("")}

      <h2>Skills</h2>
      <div class="skills">
        ${cvData.skills.map((s) => `<span class="skill">${s.name}</span>`).join("")}
      </div>
    </body>
    </html>
  `;
}

/**
 * Print CV (opens print dialog)
 */
export function printCV(cvData: CVData): void {
  const html = formatCVForPDF(cvData);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
