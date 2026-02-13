
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FolderSearch, Calendar, Gavel, FileText, Landmark, ExternalLink } from "lucide-react";
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


interface Case {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  details: string;
  nextHearing: string;
  status: 'Pending' | 'Hearing' | 'Dismissed' | 'Won';
}

const highCourts = [
  { name: "Supreme Court of India", website: "https://main.sci.gov.in/", jurisdiction: "Nationwide" },
  { name: "Allahabad High Court", website: "http://www.allahabadhighcourt.in/", jurisdiction: "Uttar Pradesh" },
  { name: "Andhra Pradesh High Court", website: "https://hc.ap.nic.in/", jurisdiction: "Andhra Pradesh" },
  { name: "Bombay High Court", website: "https://bombayhighcourt.nic.in/", jurisdiction: "Maharashtra, Goa, Dadra and Nagar Haveli and Daman and Diu" },
  { name: "Calcutta High Court", website: "https://www.calcuttahighcourt.gov.in/", jurisdiction: "West Bengal, Andaman and Nicobar Islands" },
  { name: "Chhattisgarh High Court", website: "https://highcourt.cg.gov.in/", jurisdiction: "Chhattisgarh" },
  { name: "Delhi High Court", website: "https://delhihighcourt.nic.in/", jurisdiction: "Delhi" },
  { name: "Gauhati High Court", website: "https://ghconline.gov.in/", jurisdiction: "Assam, Nagaland, Mizoram, Arunachal Pradesh" },
  { name: "Gujarat High Court", website: "https://gujarathighcourt.nic.in/", jurisdiction: "Gujarat" },
  { name: "Himachal Pradesh High Court", website: "https://hphighcourt.nic.in/", jurisdiction: "Himachal Pradesh" },
  { name: "Jammu & Kashmir and Ladakh High Court", website: "https://jkhighcourt.nic.in/", jurisdiction: "Jammu & Kashmir, Ladakh" },
  { name: "Jharkhand High Court", website: "https://jharkhandhighcourt.nic.in/", jurisdiction: "Jharkhand" },
  { name: "Karnataka High Court", website: "https://karnatakajudiciary.kar.nic.in/", jurisdiction: "Karnataka" },
  { name: "Kerala High Court", website: "https://highcourtofkerala.nic.in/", jurisdiction: "Kerala, Lakshadweep" },
  { name: "Madhya Pradesh High Court", website: "https://mphc.gov.in/", jurisdiction: "Madhya Pradesh" },
  { name: "Madras High Court", website: "https://www.hcmadras.tn.nic.in/", jurisdiction: "Tamil Nadu, Puducherry" },
  { name: "Manipur High Court", website: "https://hcmimphal.nic.in/", jurisdiction: "Manipur" },
  { name: "Meghalaya High Court", website: "https://meghalayahighcourt.nic.in/", jurisdiction: "Meghalaya" },
  { name: "Orissa High Court", website: "https://www.orissahighcourt.nic.in/", jurisdiction: "Odisha" },
  { name: "Patna High Court", website: "https://patnahighcourt.gov.in/", jurisdiction: "Bihar" },
  { name: "Punjab and Haryana High Court", website: "https://highcourtchd.gov.in/", jurisdiction: "Punjab, Haryana, Chandigarh" },
  { name: "Rajasthan High Court", website: "https://hcraj.nic.in/", jurisdiction: "Rajasthan" },
  { name: "Sikkim High Court", website: "https://hcs.gov.in/", jurisdiction: "Sikkim" },
  { name: "Telangana High Court", website: "https://tshc.gov.in/", jurisdiction: "Telangana" },
  { name: "Tripura High Court", website: "https://thc.nic.in/", jurisdiction: "Tripura" },
  { name: "Uttarakhand High Court", website: "https://highcourtofuttarakhand.gov.in/", jurisdiction: "Uttarakhand" },
];

const indianStates = [
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "AP", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CH", name: "Chandigarh" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JK", name: "Jammu and Kashmir" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OR", name: "Odisha" },
    { code: "PY", name: "Puducherry" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "TR", name: "Tripura" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "UK", name: "Uttarakhand" },
    { code: "WB", name: "West Bengal" }
];


export default function MyCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [searchType, setSearchType] = useState("cnr");

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
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push("/dashboard/my-cases/results");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Case Management"
        description="Track your cases manually and search the eCourts database."
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
          <CardTitle>My Tracked Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="mx-auto bg-muted p-4 rounded-full">
                    <FolderSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Cases Found</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                    You haven&apos;t added any cases yet. Click &quot;Add New Case&quot; to get started or use the eCourts search below.
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
      
      <Card>
        <CardHeader>
            <CardTitle>eCourts Search</CardTitle>
            <CardDescription>Search for case details from various courts across India.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="cnr" onValueChange={(value) => setSearchType(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cnr">CNR Number</TabsTrigger>
                    <TabsTrigger value="party">Party Name</TabsTrigger>
                    <TabsTrigger value="filing">Filing Number</TabsTrigger>
                    <TabsTrigger value="case">Case Number</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSearch}>
                    <TabsContent value="cnr" className="pt-4">
                        <div className="space-y-4">
                            <Input placeholder="Enter 16-digit CNR Number" required />
                            <Button type="submit" className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search by CNR
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="party" className="pt-4">
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Select required name="state">
                                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                 <Select required name="district">
                                    <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dist1">District 1 (Sample)</SelectItem>
                                        <SelectItem value="dist2">District 2 (Sample)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Petitioner/Respondent Name" name="partyName" required />
                                <Input type="number" placeholder="Year" name="year" required />
                            </div>
                            <Button type="submit" className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search by Party Name
                            </Button>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="filing" className="pt-4">
                         <div className="space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Select required name="state">
                                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                 <Select required name="courtComplex">
                                    <SelectTrigger><SelectValue placeholder="Court Complex" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="complex1">Complex 1 (Sample)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Filing Number" name="filingNumber" required />
                                <Input type="number" placeholder="Year" name="year" required />
                            </div>
                            <Button type="submit" className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search by Filing Number
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="case" className="pt-4">
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                <Select required name="state">
                                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                 <Select required name="district">
                                    <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dist1">District 1 (Sample)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select required name="courtEstablishment">
                                    <SelectTrigger><SelectValue placeholder="Court Establishment" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="est1">Establishment 1 (Sample)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select required name="caseType">
                                    <SelectTrigger><SelectValue placeholder="Case Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="type1">Type 1 (Sample)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                    <Input placeholder="Case Number" name="caseNumber" required />
                                    <Input type="number" placeholder="Year" name="year" required />
                                </div>
                            </div>
                            <Button type="submit" className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search by Case Number
                            </Button>
                        </div>
                    </TabsContent>
                </form>
            </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>High Courts of India</CardTitle>
          <CardDescription>Quick links to the official websites of various High Courts.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highCourts.map((court) => (
            <Card key={court.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Landmark className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{court.name}</h3>
                  <p className="text-xs text-muted-foreground">{court.jurisdiction}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={court.website} target="_blank" rel="noopener noreferrer">
                    Visit <ExternalLink className="ml-2 h-3 w-3"/>
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

    