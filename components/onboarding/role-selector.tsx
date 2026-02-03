"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Palette,
  Code,
  Database,
  TrendingUp,
  Cloud,
  Shield,
  Brain,
  Megaphone,
} from "lucide-react";

interface RoleOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const recommendedRoles: RoleOption[] = [
  { id: "ux_design", label: "UX Design", icon: <Palette className="h-4 w-4" /> },
  { id: "backend_engineering", label: "Backend Engineering", icon: <Code className="h-4 w-4" /> },
  { id: "data_science", label: "Data Science", icon: <Database className="h-4 w-4" /> },
  { id: "marketing_strategy", label: "Marketing Strategy", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "devops", label: "DevOps", icon: <Cloud className="h-4 w-4" /> },
  { id: "cybersecurity", label: "Cybersecurity", icon: <Shield className="h-4 w-4" /> },
  { id: "ai_research", label: "AI Research", icon: <Brain className="h-4 w-4" /> },
  { id: "public_relations", label: "Public Relations", icon: <Megaphone className="h-4 w-4" /> },
];

const allRoles = [
  "Frontend Development",
  "Backend Engineering",
  "Full Stack Development",
  "UX Design",
  "UI Design",
  "Product Management",
  "Data Science",
  "Data Engineering",
  "Machine Learning",
  "AI Research",
  "DevOps",
  "Cloud Architecture",
  "Cybersecurity",
  "Mobile Development",
  "iOS Development",
  "Android Development",
  "Marketing Strategy",
  "Digital Marketing",
  "Content Marketing",
  "SEO/SEM",
  "Public Relations",
  "Business Analysis",
  "Project Management",
  "Scrum Master",
  "Technical Writing",
  "Quality Assurance",
  "Software Testing",
  "Database Administration",
  "Network Engineering",
  "Systems Administration",
];

interface RoleSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allRoles
      .filter(
        (role) =>
          role.toLowerCase().includes(query) && !value.includes(role)
      )
      .slice(0, 5);
  }, [searchQuery, value]);

  const handleAddRole = (role: string) => {
    if (!value.includes(role)) {
      onChange([...value, role]);
    }
    setSearchQuery("");
  };

  const handleRemoveRole = (role: string) => {
    onChange(value.filter((r) => r !== role));
  };

  const handleRecommendedClick = (role: RoleOption) => {
    if (!value.includes(role.label)) {
      onChange([...value, role.label]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          What roles or industries interest you?
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select your areas of interest to help us customize your market insights and CV improvements.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search roles (e.g. UX Design, DevOps)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />

        {/* Search Results Dropdown */}
        {filteredRoles.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
            {filteredRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleAddRole(role)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors"
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Roles */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
          {value.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="px-3 py-1.5 text-sm bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer"
            >
              {role}
              <button
                type="button"
                onClick={() => handleRemoveRole(role)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Recommended Roles */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
          Recommended for you
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          {recommendedRoles.map((role) => {
            const isSelected = value.includes(role.label);
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRecommendedClick(role)}
                disabled={isSelected}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected
                    ? "border-primary/30 bg-primary/10 text-primary opacity-50 cursor-not-allowed"
                    : "border-border bg-card text-foreground"
                )}
              >
                {role.icon}
                {role.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
