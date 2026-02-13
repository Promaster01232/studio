
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building, Landmark, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { highCourts, indianStates } from "./data";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function ECourtsSearchPage() {
    const router = useRouter();
    const [searchType, setSearchType] = useState("cnr");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mock search action
        router.push("/dashboard/ecourts-search/results");
    };

  return (
    <div className="space-y-8">
      <PageHeader
        title="eCourts Search"
        description="Search for case details from various courts across India."
      />

      <Card>
        <CardHeader>
            <CardTitle>Case Search</CardTitle>
            <CardDescription>Select a search method and enter the details below.</CardDescription>
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
