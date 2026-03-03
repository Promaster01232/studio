
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Gavel, User, Users, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { searchEcourts } from '@/ai/flows/search-ecourts';

interface SearchParams {
  cnr?: string;
  partyName?: string;
  filingNumber?: string;
  caseNumber?: string;
  [key: string]: string | string[] | undefined;
}

const getSearchDescription = (searchParams: SearchParams) => {
    if (searchParams.cnr) return `Showing results for CNR: ${searchParams.cnr}`;
    if (searchParams.partyName) return `Showing results for Party Name: ${searchParams.partyName}`;
    if (searchParams.filingNumber) return `Showing results for Filing Number: ${searchParams.filingNumber}`;
    if (searchParams.caseNumber) return `Showing results for Case Number: ${searchParams.caseNumber}`;
    return "Showing results for your query.";
};

const SearchResultsSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-10 w-48" />
                <div className="mt-4">
                    <Skeleton className="h-40 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
);

async function SearchResultsComponent({ searchParams }: { searchParams: SearchParams }) {
  const cnr = (searchParams.cnr as string) || '';
  const caseDetails = await searchEcourts({ cnr });
  
  await new Promise(resolve => setTimeout(resolve, 800));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/my-cases">
            <ArrowLeft />
            <span className="sr-only">Back to Search</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">eCourts Search Results</h1>
          <p className="text-sm text-muted-foreground">{getSearchDescription(searchParams)}</p>
        </div>
      </div>

      {caseDetails ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{caseDetails.petitioner} vs. {caseDetails.respondent}</CardTitle>
            <CardDescription>{caseDetails.caseType} - {caseDetails.filingNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-6">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Filing Number</p>
                  <p className="font-semibold">{caseDetails.filingNumber} ({caseDetails.filingDate})</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Registration Number</p>
                  <p className="font-semibold">{caseDetails.registrationNumber} ({caseDetails.registrationDate})</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">CNR Number</p>
                  <p className="font-semibold">{caseDetails.cnrNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Petitioner & Advocate</p>
                  <p className="font-semibold">{caseDetails.petitioner}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{caseDetails.petitionerAdvocate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Respondent & Advocate</p>
                  <p className="font-semibold">{caseDetails.respondent}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{caseDetails.respondentAdvocate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Under Section(s)</p>
                  <p className="font-semibold">{caseDetails.acts}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full inline-block">{caseDetails.status}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="status">
              <TabsList>
                <TabsTrigger value="status">Case Status</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="status" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Business on Date</TableHead>
                      <TableHead>Next Hearing Date</TableHead>
                      <TableHead>Judge</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caseDetails.history.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.business}</TableCell>
                        <TableCell>{item.nextHearing}</TableCell>
                        <TableCell>{item.judge}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="orders" className="pt-4">
                <div className="space-y-4">
                  {caseDetails.orders.map((order, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="font-semibold">Order Date: {order.date}</p>
                      <p className="text-sm mt-1">{order.order}</p>
                      <p className="text-xs text-muted-foreground mt-2">{order.details}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="mx-auto bg-muted p-4 rounded-full w-fit">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No Matching Case Found</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              The search did not find a match for your query. For this demo, please try CNR number <code className="font-mono bg-primary/10 p-1 rounded-sm">MHHC010012342023</code> to see a sample report.
            </p>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              To perform a live search, you can visit the official eCourts services website.
            </p>
            <Button asChild className="mt-6">
                <Link href="https://services.ecourts.gov.in/ecourtindia_v6/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Search on eCourts India
                </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default async function SearchResultsPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;
    return (
        <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResultsComponent searchParams={searchParams} />
        </Suspense>
    );
}
