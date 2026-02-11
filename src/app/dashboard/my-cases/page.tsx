"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FolderSearch, Calendar, Gavel, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Case {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  details: string;
  nextHearing: string;
  status: 'Pending' | 'Hearing' | 'Dismissed' | 'Won';
}

export default function MyCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCase: Case = {
      id: `case-${Date.now()}`,
      title: formData.get("title") as string,
      caseNumber: formData.get("caseNumber") as string,
      courtName: formData.get("courtName") as string,
      details: formData.get("details") as string,
      nextHearing: formData.get("nextHearing") as string,
      status: 'Pending',
    };
    setCases(prevCases => [...prevCases, newCase]);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Case Tracker"
        description="Manually add and track your cases."
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new case to your tracker.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCase} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Case Title
                </Label>
                <Input id="title" name="title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caseNumber" className="text-right">
                  Case Number
                </Label>
                <Input id="caseNumber" name="caseNumber" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="courtName" className="text-right">
                  Court Name
                </Label>
                <Input id="courtName" name="courtName" className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Details
                </Label>
                <Textarea id="details" name="details" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextHearing" className="text-right">
                  Next Hearing
                </Label>
                <Input id="nextHearing" name="nextHearing" type="date" className="col-span-3" required />
              </div>
               <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Case</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardHeader>
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by case title, number, or CNR..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="mx-auto bg-muted p-4 rounded-full">
                    <FolderSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Cases Found</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                    You haven&apos;t added any cases yet. Click &quot;Add New Case&quot; to get started.
                </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4 grid gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold">{c.title}</h3>
                            <p className="text-sm text-muted-foreground">{c.caseNumber}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{c.status}</span>
                    </div>
                     <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                           <Gavel className="h-4 w-4" />
                           <span>{c.courtName}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           <span>Next Hearing: {new Date(c.nextHearing).toLocaleDateString()}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <FileText className="h-4 w-4" />
                           <p className="truncate">{c.details || 'No details provided.'}</p>
                        </div>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
