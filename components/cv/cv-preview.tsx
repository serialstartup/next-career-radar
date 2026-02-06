"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye, EyeOff } from "lucide-react";

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

interface CVPreviewProps {
  data: CVData;
  onClose?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  variant?: "modal" | "page";
}

export function CVPreview({
  data,
  onClose,
  onExport,
  onPrint,
  variant = "page",
}: CVPreviewProps) {
  const actions = (
    <div className="flex items-center gap-2 mb-6">
      {onExport && (
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      )}
      {onPrint && (
        <Button variant="outline" size="sm" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      )}
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
          <EyeOff className="mr-2 h-4 w-4" />
          Close Preview
        </Button>
      )}
    </div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">CV Preview</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6">{actions}<CVContent data={data} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {actions}
      <Card>
        <CardContent className="p-8">
          <CVContent data={data} />
        </CardContent>
      </Card>
    </div>
  );
}

function CVContent({ data }: { data: CVData }) {
  return (
    <div className="cv-preview">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {data.basics.name || "Your Name"}
        </h1>
        {data.basics.title && (
          <p className="text-lg text-muted-foreground mb-4">
            {data.basics.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {data.basics.email && <span>{data.basics.email}</span>}
          {data.basics.phone && <span>{data.basics.phone}</span>}
          {data.basics.location && <span>{data.basics.location}</span>}
          {data.basics.url && (
            <a href={data.basics.url} className="text-primary hover:underline">
              {data.basics.url}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.basics.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Professional Summary
          </h2>
          <p className="text-muted-foreground">{data.basics.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.location && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {exp.location}
                  </p>
                )}
                {exp.description && (
                  <p className="text-muted-foreground mb-2">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {skill.name}
                {skill.level && (
                  <span className="text-muted-foreground ml-1">
                    ({skill.level})
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
