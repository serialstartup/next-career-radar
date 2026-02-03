"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title?: string;
  showSearch?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardHeader({
  title,
  showSearch = false,
  user,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left side - Title or Search */}
      <div className="flex items-center gap-4">
        {/* Mobile spacer for hamburger menu */}
        <div className="w-10 lg:hidden" />
        
        {title && (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
        
        {showSearch && (
          <div className="hidden md:flex relative w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-9 bg-muted/50"
            />
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Button */}
        {showSearch && (
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {/* Notification badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">
                {user?.name || "User"}
              </span>
              <ChevronDown className="hidden md:inline-block h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
