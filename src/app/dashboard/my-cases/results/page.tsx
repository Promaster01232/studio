"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Gavel, User, Users, Search } from "lucide-react";
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

const mockCase = {
    caseType: "Criminal Appeal",
    filingNumber: "Cr.A. 1234/2023",
    filingDate: "15-05-2023",
    registrationNumber: "Cr.A. 567/2023",
    registrationDate: "20-05-2023",
    cnrNumber: "MHHC010012342023",
    petitioner: "Rajesh Sharma",
    petitionerAdvocate: "Ms. Priya Singh",
    respondent: "State of Maharashtra",
    respondentAdvocate: "Mr. Sameer Khan (Public Prosecutor)",
    acts: "Indian Penal Code, 1860: 302",
    status: "Pending",
    history: [
        { date: "01-08-2024", business: "Arguments heard. Adjourned.", nextHearing: "15-09-2024", judge: "Hon'ble Justice S.K. Singh" },
        { date: "10-07-2024", business: "Notice issued to respondent.", nextHearing: "01-08-2024", judge: "Hon'ble Justice S.K. Singh" },
        { date: "20-05-2024", business: "Case registered.", nextHearing: "10-07-2024", judge: "Registrar" },
    ],
    orders: [
        { date: "10-07-2024", order: "Notice issued to respondent, returnable in four weeks.", details: "The court has directed that a formal notice be served to the opposing party, who must then appear or respond within a four-week period." },
        { date: "20-05-2024", order: "Appeal admitted.", details: "The appeal has been formally accepted by the court for hearing and further proceedings." },
    ]
};


const SearchResultsContent = () => {
    const searchParams = useSearchParams();
    const cnr = searchParams.get('cnr');
    const partyName = searchParams.get('partyName');

    const showResult = cnr === mockCase.cnrNumber || partyName;

    const getSearchDescription = () => {
        if (cnr) return `Showing results for CNR: ${cnr}`;
        if (partyName) return `Showing results for Party Name: ${partyName}`;
        if (searchParams.get('filingNumber')) return `Showing results for Filing Number: ${searchParams.get('filingNumber')}`;
        if (searchParams.get('caseNumber')) return `Showing results for Case Number: ${searchParams.get('caseNumber')}`;
        return "Showing results for your query.";
    }

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
                    <p className="text-sm text-muted-foreground">{getSearchDescription()}</p>
                </div>
            </div>

            {showResult ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{mockCase.petitioner} vs. {mockCase.respondent}</CardTitle>
                        <CardDescription>{mockCase.caseType} - {mockCase.filingNumber}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-6">
                            <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Filing Number</p>
                                    <p className="font-semibold">{mockCase.filingNumber} ({mockCase.filingDate})</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Registration Number</p>
                                    <p className="font-semibold">{mockCase.registrationNumber} ({mockCase.registrationDate})</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Gavel className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">CNR Number</p>
                                    <p className="font-semibold">{mockCase.cnrNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Petitioner & Advocate</p>
                                    <p className="font-semibold">{mockCase.petitioner}</p>
                                    <p className="text-xs font-semibold text-muted-foreground">{mockCase.petitionerAdvocate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Respondent & Advocate</p>
                                    <p className="font-semibold">{mockCase.respondent}</p>
                                    <p className="text-xs font-semibold text-muted-foreground">{mockCase.respondentAdvocate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Gavel className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Under Section(s)</p>
                                    <p className="font-semibold">{mockCase.acts}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 mt-1 text-primary"/>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <p className="font-semibold px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full inline-block">{mockCase.status}</p>
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
                                        {mockCase.history.map((item, index) => (
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
                                    {mockCase.orders.map((order, index) => (
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
                        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                            We couldn't find a case matching your search criteria. Please check the details and try again. For this demo, try CNR <code className="font-mono bg-primary/10 p-1 rounded-sm">MHHC010012342023</code>.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
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

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResultsContent />
        </Suspense>
    );
}
