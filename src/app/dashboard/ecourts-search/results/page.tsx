
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Gavel, User, Users } from "lucide-react";
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


const mockCase = {
    caseType: "Criminal Appeal",
    filingNumber: "Cr.A. 1234/2023",
    filingDate: "15-05-2023",
    registrationNumber: "Cr.A. 567/2023",
    registrationDate: "20-05-2023",
    cnrNumber: "MHHC010012342023",
    petitioner: "Rajesh Sharma",
    respondent: "State of Maharashtra",
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

export default function SearchResultsPage() {

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/ecourts-search">
                        <ArrowLeft />
                        <span className="sr-only">Back to Search</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">eCourts Search Results</h1>
                    <p className="text-sm text-muted-foreground">Showing results for your query.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{mockCase.petitioner} vs. {mockCase.respondent}</CardTitle>
                    <CardDescription>{mockCase.caseType} - {mockCase.filingNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
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
                                <p className="text-muted-foreground">Petitioner</p>
                                <p className="font-semibold">{mockCase.petitioner}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="h-4 w-4 mt-1 text-primary"/>
                            <div>
                                <p className="text-muted-foreground">Respondent</p>
                                <p className="font-semibold">{mockCase.respondent}</p>
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
        </div>
    )
}
