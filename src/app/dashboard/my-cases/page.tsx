
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FolderSearch, Calendar, Gavel, FileText, Landmark, ExternalLink, RefreshCcw, Loader2, Trash2, Eye } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { highCourts, indianStates } from "./data";
import { useToast } from "@/hooks/use-toast";


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
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [searchType, setSearchType] = useState("cnr");

  const handleAddCase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingSave(true);
    const formData = new FormData(event.currentTarget);
    
    setTimeout(() => {
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
        setLoadingSave(false);
        setIsDialogOpen(false);
        toast({ title: "Case Saved", description: "Successfully added to your personal tracker." });
    }, 1500);
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoadingSearch(true);
      const formData = new FormData(e.currentTarget);
      const query = new URLSearchParams();
      formData.forEach((value, key) => {
        if (value && key !== 'captcha') {
            query.append(key, value.toString());
        }
      });
      
      setTimeout(() => {
          router.push(`/dashboard/my-cases/results?${query.toString()}`);
          setLoadingSearch(false);
      }, 1500);
  };

  const handleDelete = (id: string) => {
      setProcessingId(id);
      setTimeout(() => {
          setCases(prev => prev.filter(c => c.id !== id));
          setProcessingId(null);
          toast({ title: "Case Removed", description: "The record has been purged from your tracker." });
      }, 1000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Case Management"
        description="Track your personal cases manually or search the official eCourts database for real-time status."
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" />
              Track New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary/5 p-6 border-b border-primary/5">
              <DialogTitle className="font-headline font-black text-xl tracking-tight">Manual Case Tracking</DialogTitle>
              <DialogDescription className="font-medium text-xs">
                Save case details to your dashboard for quick access and reminders.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCase} className="p-6 space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Case Title</Label>
                <Input id="title" name="title" placeholder="e.g., Property Dispute - XYZ" required className="h-11 font-bold" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseNumber" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Case Number</Label>
                    <Input id="caseNumber" name="caseNumber" placeholder="e.g., OS 123/2024" required className="h-11 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courtName" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Court Name</Label>
                    <Input id="courtName" name="courtName" placeholder="e.g., Civil Court" required className="h-11 font-bold" />
                  </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="details" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Case Synopsis</Label>
                <Textarea id="details" name="details" placeholder="Briefly describe the matter..." className="font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextHearing" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Next Hearing Date</Label>
                <Input id="nextHearing" name="nextHearing" type="date" required className="h-11 font-bold" />
              </div>
               <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="h-11 font-bold">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="h-11 px-8 font-bold shadow-xl shadow-primary/20" disabled={loadingSave}>
                    {loadingSave ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save to Dashboard
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card className="border-primary/5 shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-muted/30 border-b border-primary/5">
          <CardTitle className="font-headline font-black text-lg tracking-tight">Active Tracker</CardTitle>
          <CardDescription className="text-xs font-medium">Cases currently being monitored in your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="mx-auto bg-primary/5 p-6 rounded-full">
                    <FolderSearch className="h-12 w-12 text-primary opacity-40" />
                </div>
                <h3 className="mt-6 text-xl font-black tracking-tight font-headline">No Cases Found</h3>
                <p className="mt-2 text-muted-foreground max-w-sm text-xs font-medium leading-relaxed">
                    You haven&apos;t added any cases yet. Click &quot;Track New Case&quot; to get started or use the official eCourts search below.
                </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {cases.map((c) => (
                <Card key={c.id} className="border-primary/10 hover:border-primary/30 transition-all group">
                  <CardContent className="p-5 text-left">
                    <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                            <h3 className="font-black text-base tracking-tight truncate group-hover:text-primary transition-colors">{c.title}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{c.caseNumber}</p>
                        </div>
                        <span className="text-[9px] font-black px-2 py-1 rounded-md bg-primary/10 text-primary uppercase">{c.status}</span>
                    </div>
                     <div className="text-xs font-medium text-muted-foreground space-y-2 mb-6">
                        <div className="flex items-center gap-2">
                           <Gavel className="h-3.5 w-3.5 text-primary opacity-60" />
                           <span>{c.courtName}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="h-3.5 w-3.5 text-primary opacity-60" />
                           <span>Hearing: {new Date(c.nextHearing).toLocaleDateString()}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <FileText className="h-3.5 w-3.5 text-primary opacity-60 shrink-0" />
                           <p className="truncate opacity-80">{c.details || 'No synopsis provided.'}</p>
                        </div>
                    </div>
                     <div className="flex gap-2 pt-4 border-t border-primary/5">
                        <Button variant="outline" size="sm" className="flex-1 h-9 font-bold rounded-lg text-[10px] uppercase tracking-wider">
                            <Eye className="h-3 w-3 mr-1.5" /> Inspect
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => handleDelete(c.id)}
                            disabled={processingId === c.id}
                        >
                            {processingId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-primary/5 shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-muted/30 border-b border-primary/5">
            <CardTitle className="font-headline font-black text-lg tracking-tight">eCourts Registry Search</CardTitle>
            <CardDescription className="text-xs font-medium">Search for official records from high courts and district complexes across India.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
            <Tabs defaultValue="cnr" onValueChange={(value) => setSearchType(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-muted/20 p-1 rounded-xl mb-8">
                    <TabsTrigger value="cnr" className="font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg data-[state=active]:shadow-lg">CNR Number</TabsTrigger>
                    <TabsTrigger value="party" className="font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg data-[state=active]:shadow-lg">Party Name</TabsTrigger>
                    <TabsTrigger value="filing" className="font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg data-[state=active]:shadow-lg">Filing No.</TabsTrigger>
                    <TabsTrigger value="case" className="font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg data-[state=active]:shadow-lg">Case No.</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSearch}>
                    <TabsContent value="cnr" className="pt-0">
                       <div className="max-w-xl mx-auto">
                            <Card className="bg-primary/5 border-primary/10 rounded-2xl shadow-inner">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Identity Search</CardTitle>
                                    <CardDescription className="font-medium text-[11px]">Enter 16-digit CNR, e.g. MHHC010012342023</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 text-left">
                                    <div className="space-y-2">
                                        <Label htmlFor="cnr" className="text-[11px] font-bold text-muted-foreground">CNR number</Label>
                                        <Input id="cnr" name="cnr" placeholder="16-digit CNR Number" required className="h-12 font-bold text-lg bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="captcha" className="text-[11px] font-bold text-muted-foreground">Verify you are human</Label>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-32 bg-background border flex items-center justify-center font-mono tracking-widest text-lg font-black rounded-lg select-none">dmmudd</div>
                                            <Button variant="outline" size="icon" type="button" className="h-12 w-12 rounded-lg"><RefreshCcw className="h-4 w-4" /></Button>
                                            <Input id="captcha" name="captcha" placeholder="Code" className="h-12 font-bold bg-background flex-1" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-12 text-lg font-black shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4" disabled={loadingSearch}>
                                        {loadingSearch ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
                                        Run Search
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="party" className="pt-0 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Select State</Label>
                                <Select required name="state">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="State" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code} className="font-bold">{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Select District</Label>
                                <Select required name="district">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="District" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dist1" className="font-bold">District Court Hub</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Party Name</Label>
                                <Input placeholder="Name of Petitioner" name="partyName" required className="h-11 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Filing Year</Label>
                                <Input type="number" placeholder="2024" name="year" required className="h-11 font-bold" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto h-11 px-10 font-bold shadow-lg shadow-primary/20" disabled={loadingSearch}>
                            {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            Search Party Records
                        </Button>
                    </TabsContent>
                    
                    <TabsContent value="filing" className="pt-0 space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Select State</Label>
                                <Select required name="state">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="State" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code} className="font-bold">{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Court Complex</Label>
                                <Select required name="courtComplex">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="Complex" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="complex1" className="font-bold">Main Complex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Filing No.</Label>
                                <Input placeholder="Number" name="filingNumber" required className="h-11 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Year</Label>
                                <Input type="number" placeholder="2024" name="year" required className="h-11 font-bold" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto h-11 px-10 font-bold shadow-lg shadow-primary/20" disabled={loadingSearch}>
                            {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            Search Filing Number
                        </Button>
                    </TabsContent>

                    <TabsContent value="case" className="pt-0 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">State</Label>
                                <Select required name="state">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code} className="font-bold">{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Establishment</Label>
                                <Select required name="courtEstablishment">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="Establishment" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="est1" className="font-bold">Establishment 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Type</Label>
                                <Select required name="caseType">
                                    <SelectTrigger className="h-11 font-bold"><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="type1" className="font-bold">Criminal Case</SelectItem>
                                        <SelectItem value="type2" className="font-bold">Civil Case</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Number</Label>
                                <Input placeholder="Case #" name="caseNumber" required className="h-11 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest px-1">Year</Label>
                                <Input type="number" placeholder="2024" name="year" required className="h-11 font-bold" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={loadingSearch}>
                            {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            Search Case Number
                        </Button>
                    </TabsContent>
                </form>
            </Tabs>
        </CardContent>
      </Card>
      
      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/5">
          <CardTitle className="font-headline font-black text-lg tracking-tight">Official High Court Portal Directory</CardTitle>
          <CardDescription className="text-xs font-medium">Quick access to secure official judicial websites.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {highCourts.map((court) => (
            <Card key={court.name} className="hover:shadow-lg transition-all border-primary/10 hover:border-primary/30 group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <Landmark className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-black text-sm tracking-tight truncate">{court.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter truncate">{court.jurisdiction}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary hover:text-white" asChild>
                  <a href={court.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4"/>
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
