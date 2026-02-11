
"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Search, User, FileText, Gavel } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const suggestions = [
    { name: "Anjali Sharma", type: "Advocate", icon: User, href: "/dashboard/lawyer-connect/1" },
    { name: "Siddharth Rao", type: "Advocate", icon: User, href: "/dashboard/lawyer-connect/2" },
    { name: "Mehra v. Sharma", type: "Case", icon: Gavel, href: "/dashboard/my-cases" },
    { name: "Generate Legal Notice", type: "Action", icon: FileText, href: "/dashboard/document-generator" },
];

export function SearchDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
          <DialogDescription>
              Search across advocates, cases, documents and more.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">Suggestions</h3>
          <div className="flex flex-col space-y-1">
              {suggestions.map((suggestion) => (
                  <button
                      key={suggestion.href}
                      onClick={() => runCommand(suggestion.href)}
                      className="flex items-center p-2 rounded-md hover:bg-accent text-sm text-left w-full"
                  >
                      <suggestion.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{suggestion.name}</span>
                  </button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
