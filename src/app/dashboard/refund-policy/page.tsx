
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-foreground/10 pb-8">
        <PageHeader
          title="Refund help"
          description="Direct statutory policy for Nyaya Sahayak terminal."
        />
        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to hub
          </Link>
        </Button>
      </div>

      <div className="whitespace-pre-line font-medium text-sm sm:text-base leading-relaxed text-foreground/80 selection:bg-primary/10">
        Return and Refund Policy for Nyaya Sahayak
        
        Return and Refund Policy
        Last updated: April 10, 2026
        
        Thank you for shopping at Nyaya Sahayak.
        
        If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns. This Return and Refund Policy has been created with the help of the TermsFeed Return and Refund Policy Generator.
        
        The following terms are applicable for any products that You purchased with Us.
        
        Interpretation and Definitions
        Interpretation
        The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        
        Definitions
        For the purposes of this Return and Refund Policy:
        
        Company (referred to as either "the Company", "We", "Us" or "Our" in this Policy) refers to Nyaya Sahayak.
        
        Goods refer to the items offered for sale on the Service.
        
        Orders mean a request by You to purchase Goods from Us.
        
        Service refers to the Website.
        
        Website refers to Nyaya Sahayak, accessible from https://nyayasahayak.in.
        
        You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
        
        Your Order Cancellation Rights
        You are entitled to cancel Your Order within 7 days without giving any reason for doing so.
        
        The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.
        
        In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform Us of your decision by:
        
        By email: nyayasahayakhelp@gmail.com
        
        By visiting this page on our website: https://nyayasahayak.in/
        
        By phone: 6299827864
        
        We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.
        
        AI and Payment Protection
        1. AI operational failure: If our AI engine fails to answer your question or complete a task despite deducting credits, we refund you.
        2. Payment gateway error: If your payment fails, double payments occur, or payment is captured but service is not started, we refund you.
        3. Incorrect report: If the AI gives a fundamentally wrong report or misses clear laws, you can claim a refund for manual audit.
        
        Conditions for Returns
        In order for the Goods to be eligible for a return, please make sure that:
        
        The Goods were purchased in the last 7 days
        The Goods are in the original packaging
        The following Goods cannot be returned:
        
        The supply of Goods made to Your specifications or clearly personalized.
        The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.
        The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.
        The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.
        We may refuse returns that do not meet the conditions above, to the extent permitted by applicable law.
        
        Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law.
        
        Returning Goods
        You are responsible for the cost and risk of returning the Goods to Us.
        
        You should send the Goods at the following address:
        
        In website
        
        We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.
        
        Gifts
        If the Goods were marked as a gift when purchased and then shipped directly to you, You'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to You.
        
        If the Goods weren't marked as a gift when purchased, or the gift giver had the Order shipped to themselves to give it to You later, We will send the refund to the gift giver.
        
        Contact Us
        If you have any questions about our Returns and Refunds Policy, please contact us:
        
        By email: nyayasahayakhelp@gmail.com
        
        By visiting this page on our website: https://nyayasahayak.in/
        
        By phone: 6299827864
      </div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // REFUND PROTOCOL // 2026</p>
      </div>
    </div>
  );
}
