
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Return and Refund Policy for Nyaya Sahayak
 * Plain text presentation for absolute statutory clarity.
 */
export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-foreground/10 pb-8"
      >
        <PageHeader
          title="Refund help"
          description="Direct statutory policy for Nyaya Sahayak terminal."
        />
        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to hub
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-card p-8 sm:p-12 rounded-[2.5rem] border border-primary/5 shadow-xl"
      >
        <div className="whitespace-pre-line font-medium text-sm sm:text-base leading-relaxed text-foreground/80 selection:bg-primary/10">
          <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-foreground">Return and Refund Policy for Nyaya Sahayak</h2>
          
          <p className="mb-4"><strong>Last updated: April 10, 2026</strong></p>
          
          <p className="mb-6">Thank you for shopping at Nyaya Sahayak. If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns. This Return and Refund Policy has been created with the help of the TermsFeed Return and Refund Policy Generator.</p>
          
          <p className="mb-6">The following terms are applicable for any products that You purchased with Us.</p>
          
          <h3 className="text-lg font-black mt-10 mb-4 uppercase">Interpretation and Definitions</h3>
          <p className="mb-4"><strong>Interpretation:</strong> The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          
          <p className="mb-4"><strong>Definitions:</strong> For the purposes of this Return and Refund Policy:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Company:</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Policy) refers to Nyaya Sahayak.</li>
            <li><strong>Goods:</strong> refer to the items offered for sale on the Service.</li>
            <li><strong>Orders:</strong> mean a request by You to purchase Goods from Us.</li>
            <li><strong>Service:</strong> refers to the Website.</li>
            <li><strong>Website:</strong> refers to Nyaya Sahayak, accessible from https://nyayasahayak.in.</li>
            <li><strong>You:</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
          </ul>

          <h3 className="text-lg font-black mt-10 mb-4 uppercase">Your Order Cancellation Rights</h3>
          <p className="mb-4">You are entitled to cancel Your Order within 7 days without giving any reason for doing so.</p>
          <p className="mb-4">The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.</p>
          <p className="mb-4">In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform Us of your decision by:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>By email: <strong>nyayasahayakhelp@gmail.com</strong></li>
            <li>By visiting this page on our website: <strong>https://nyayasahayak.in/</strong></li>
            <li>By phone: <strong>6299827864</strong></li>
          </ul>
          <p className="mb-8">We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.</p>

          <h3 className="text-lg font-black mt-10 mb-4 uppercase text-primary">AI and Payment Protection</h3>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 mb-8 space-y-4">
            <p><strong>1. AI operational failure:</strong> If our AI engine fails to answer your question or complete a task despite deducting credits, we refund you.</p>
            <p><strong>2. Payment gateway error:</strong> If your payment fails, double payments occur, or payment is captured but service is not started, we refund you.</p>
            <p><strong>3. Incorrect report:</strong> If the AI gives a fundamentally wrong report or misses clear laws, you can claim a refund for manual audit.</p>
          </div>

          <h3 className="text-lg font-black mt-10 mb-4 uppercase">Conditions for Returns</h3>
          <p className="mb-4">In order for the Goods to be eligible for a return, please make sure that:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>The Goods were purchased in the last 7 days</li>
            <li>The Goods are in the original packaging</li>
          </ul>
          <p className="mb-4">The following Goods cannot be returned:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>The supply of Goods made to Your specifications or clearly personalized.</li>
            <li>The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li>
            <li>The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li>
            <li>The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.</li>
          </ul>
          <p className="mb-8">We may refuse returns that do not meet the conditions above, to the extent permitted by applicable law. Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded.</p>

          <h3 className="text-lg font-black mt-10 mb-4 uppercase">Returning Goods</h3>
          <p className="mb-4">You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods to the address mentioned on our official website.</p>
          <p className="mb-8">We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.</p>

          <h3 className="text-lg font-black mt-10 mb-4 uppercase">Contact Us</h3>
          <p className="mb-2">If you have any questions about our Returns and Refunds Policy, please contact us:</p>
          <p className="mb-1">By email: <strong>nyayasahayakhelp@gmail.com</strong></p>
          <p className="mb-1">By phone: <strong>6299827864</strong></p>
        </div>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // REFUND PROTOCOL // 2026</p>
      </div>
    </div>
  );
}
