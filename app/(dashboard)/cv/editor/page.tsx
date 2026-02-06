"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

// Mock user data
const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
};

// Mock CV data
const mockCVData = {
  basics: {
    name: "Alex Thompson",
    email: "alex@example.com",
    phone: "+44 20 1234 5678",
    title: "Senior Frontend Developer",
    summary: "Experienced frontend developer with 6+ years of experience building scalable web applications.",
    location: "London, UK",
    url: "https://alexthompson.dev",
  },
  experience: [
    {
      id: "1",
      company: "TechCorp",
      title: "Senior Frontend Developer",
      location: "London, UK",
      startDate: "2021-01",
      endDate: "",
      isCurrent: true,
      description: "Leading the frontend team in building a next-generation SaaS platform.",
      achievements: [
        "Reduced page load time by 40% through code splitting and lazy loading",
        "Mentored 3 junior developers and established code review processes",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Cambridge",
      degree: "MSc Computer Science",
      fieldOfStudy: "Software Engineering",
      startDate: "2017-09",
      endDate: "2018-12",
      gpa: 4.0,
    },
  ],
  skills: [
    { id: "1", name: "React", level: "Expert", yearsOfExperience: 6 },
    { id: "2", name: "TypeScript", level: "Expert", yearsOfExperience: 4 },
    { id: "3", name: "Next.js", level: "Advanced", yearsOfExperience: 3 },
  ],
};

export default function CVEditorPage() {
  const [activeTab, setActiveTab] = useState("basics");
  const [cvData] = useState(mockCVData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="CV Editor" user={mockUser} />

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cv">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-sm font-semibold">Software Engineer CV</h2>
            <p className="text-xs text-muted-foreground">Last edited 2 hours ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>CV Completion</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-primary rounded-full" />
            </div>
          </div>

          {/* Editor Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter your personal and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={cvData.basics.name} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" defaultValue={cvData.basics.title} placeholder="Senior Software Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={cvData.basics.email} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={cvData.basics.phone} placeholder="+1 234 567 8900" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={cvData.basics.location} placeholder="City, Country" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">Website / LinkedIn</Label>
                      <Input id="url" defaultValue={cvData.basics.url} placeholder="https://yourwebsite.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea id="summary" defaultValue={cvData.basics.summary} placeholder="Write a brief summary..." className="min-h-[120px]" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Work Experience</CardTitle>
                      <CardDescription>Add your relevant work experience</CardDescription>
                    </div>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Experience</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                        </div>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input type="month" defaultValue={exp.startDate} />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input type="month" defaultValue={exp.endDate} disabled={exp.isCurrent} />
                        </div>
                        <div className="space-y-2">
                          <Label>Current Position</Label>
                          <div className="flex items-center gap-2 h-10">
                            <input type="checkbox" id={`current-${exp.id}`} defaultChecked={exp.isCurrent} className="h-4 w-4" />
                            <Label htmlFor={`current-${exp.id}`} className="text-sm">I currently work here</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea defaultValue={exp.description} placeholder="Describe your responsibilities..." />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Education</CardTitle>
                      <CardDescription>Add your educational background</CardDescription>
                    </div>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Education</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{edu.institution}</h4>
                          <p className="text-sm text-muted-foreground">{edu.degree} in {edu.fieldOfStudy}</p>
                        </div>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input defaultValue={edu.institution} />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input defaultValue={edu.degree} />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input defaultValue={edu.fieldOfStudy} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Skills</CardTitle>
                      <CardDescription>Add your technical and professional skills</CardDescription>
                    </div>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Skill</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2 border rounded-lg px-3 py-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary">{skill.level}</Badge>
                        <span className="text-sm text-muted-foreground">{skill.yearsOfExperience}y</span>
                        <Button variant="ghost" size="icon"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter Summary</CardTitle>
                  <CardDescription>Write a brief summary for your CV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea placeholder="Write a compelling summary..." className="min-h-[200px]" />
                  <div className="flex items-center gap-4">
                    <Button><ArrowRight className="mr-2 h-4 w-4" />Generate with AI</Button>
                    <p className="text-sm text-muted-foreground">AI will help you write a compelling summary</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button>
            <Button>Next<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
