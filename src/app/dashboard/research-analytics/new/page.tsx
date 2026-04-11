'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Loader2, 
  ListPlus, 
  X, 
  Edit, 
  Send, 
  Link as LinkIcon, 
  ArrowLeft, 
  ShieldCheck, 
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

interface UserProfile {
    firstName: string;
    lastName: string;
    photoURL?: string;
    email?: string;
    isAdmin?: boolean;
}

export default function NewPostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [activeTab, setActiveTab] = useState('idea');
    
    // Form states
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [postType, setPostType] = useState('Idea');
    const [tags, setTags] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            const userDocRef = doc(firestore, "users", auth.currentUser.uid);
            getDoc(userDocRef).then(userDoc => {
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            });
        } else {
            router.push('/login');
        }
    }, [auth, firestore, router]);

    const handleAddPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };
    
    const handleRemovePollOption = (index: number) => {
        const newOptions = pollOptions.filter((_, i) => i !== index);
        setPollOptions(newOptions);
    };

    const handlePostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!auth.currentUser || !userProfile) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to create a post.' });
            return;
        }

        const isPoll = activeTab === 'poll';
        const finalTitle = isPoll ? pollQuestion : title;

        if (!finalTitle) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all required fields.' });
            return;
        }
        
        setIsPosting(true);

        const newPostData: any = {
            authorUid: auth.currentUser.uid,
            authorName: isAnonymous ? 'Anonymous' : `${userProfile.firstName} ${userProfile.lastName}`,
            title: finalTitle,
            content: isPoll ? '' : content,
            link: isPoll ? '' : link,
            likes: 0,
            likedBy: [],
            comments: 0,
            postType: isPoll ? 'Poll' : postType,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            isAnonymous: isAnonymous,
            createdAt: serverTimestamp(),
        };

        if (!isAnonymous && userProfile.photoURL) {
            newPostData.authorAvatar = userProfile.photoURL;
        }

        if (isPoll) {
            newPostData.poll = {
                options: pollOptions.map(opt => opt.trim()).filter(Boolean).map(opt => ({ text: opt, votes: 0 })),
                voters: []
            };
        }

        const postsCol = collection(firestore, "posts");
        addDoc(postsCol, newPostData)
            .then(() => {
                toast({ title: "Post Published!", description: "Your new transmission has been added to the registry." });
                router.push('/dashboard/research-analytics');
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postsCol.path,
                    operation: 'create',
                    requestResourceData: newPostData,
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
                setIsPosting(false);
            });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-20 px-2 sm:px-0 text-left"
        >
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
                    <Link href="/dashboard/research-analytics">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Go Back
                    </Link>
                </Button>
                <Badge variant="outline" className="h-8 border-primary/10 font-bold bg-background shadow-sm px-4 rounded-lg text-[10px] uppercase tracking-widest text-muted-foreground">
                    Node: New Transmission
                </Badge>
            </div>

            <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 sm:p-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <PlusCircle className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-3xl font-black font-headline tracking-tighter">Initialize Registry Post</CardTitle>
                    </div>
                    <CardDescription className="text-sm font-medium opacity-70">
                        Disseminate ideas, queries, or suggestions to the institutional community.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-10">
                    <form onSubmit={handlePostSubmit} className="space-y-10">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/20 p-1.5 rounded-[1.2rem] mb-10">
                                <TabsTrigger value="idea" className="font-black text-[11px] uppercase tracking-widest rounded-xl data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                    <Edit className="mr-2 h-4 w-4"/>Textual Node
                                </TabsTrigger>
                                <TabsTrigger value="poll" className="font-black text-[11px] uppercase tracking-widest rounded-xl data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                    <ListPlus className="mr-2 h-4 w-4"/>Community Poll
                                </TabsTrigger>
                            </TabsList>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-10"
                            >
                                <div className="flex items-center justify-between rounded-[1.5rem] border border-primary/5 bg-primary/5 p-6 transition-all hover:bg-primary/10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Zap className="h-4 w-4" />
                                            <Label htmlFor="anonymous-idea" className="text-base font-black tracking-tight cursor-pointer">Identity Masking</Label>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Hide your node ID from the public registry.</p>
                                    </div>
                                    <Switch id="anonymous-idea" checked={isAnonymous} onCheckedChange={setIsAnonymous} className="data-[state=checked]:bg-primary" />
                                </div>
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <TabsContent value="idea" key="idea" className="mt-0 space-y-8 focus-visible:ring-0">
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="postType" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Transmission Protocol</Label>
                                            <Select value={postType} onValueChange={setPostType}>
                                                <SelectTrigger id="postType" className="h-14 glass border-primary/5 font-bold rounded-2xl active:scale-95 transition-all text-base">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                                    <SelectItem value="Idea" className="font-bold">Institutional Idea</SelectItem>
                                                    <SelectItem value="Question" className="font-bold">Forensic Query</SelectItem>
                                                    <SelectItem value="Suggestion" className="font-bold">Statutory Suggestion</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Registry Tags</Label>
                                            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="policy, reform, technology" className="h-14 glass border-primary/5 rounded-2xl font-bold px-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Statutory Headline</Label>
                                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a concise title for your transmission" required={activeTab === 'idea'} className="h-14 glass border-primary/5 rounded-2xl font-black text-xl px-6 tracking-tight" />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Dossier Body</Label>
                                        <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Elaborate on your institutional insight or query..." rows={8} className="glass border-primary/5 rounded-[2rem] font-medium text-base p-6 resize-none shadow-inner" />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label htmlFor="link" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">External Citation</Label>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10 pointer-events-none"></div>
                                            <div className="p-6 space-y-4">
                                                <div className="flex items-center gap-3 text-primary opacity-40">
                                                    <LinkIcon className="h-5 w-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Reference URL</span>
                                                </div>
                                                <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://statute.gov.in" className="h-12 glass border-primary/5 rounded-xl font-bold px-4" />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="poll" key="poll" className="mt-0 space-y-8 focus-visible:ring-0">
                                    <div className="space-y-3">
                                        <Label htmlFor="pollQuestion" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Polling Mandate</Label>
                                        <Input id="pollQuestion" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="State the question for community consensus" required={activeTab === 'poll'} className="h-16 glass border-primary/5 rounded-2xl font-black text-xl px-6 tracking-tight" />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Consensus Nodes (Options)</Label>
                                        <div className="grid gap-4">
                                            {pollOptions.map((option, index) => (
                                                <motion.div 
                                                    key={index} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="flex-1 relative group">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10 text-primary font-black text-[10px]">
                                                            {index + 1}
                                                        </div>
                                                        <Input 
                                                            placeholder={`Protocol Option ${index + 1}`}
                                                            value={option}
                                                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                                            required={activeTab === 'poll'}
                                                            className="h-14 glass border-primary/5 rounded-2xl font-bold pl-14 transition-all focus:border-primary"
                                                        />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePollOption(index)} disabled={pollOptions.length <= 2} className="h-14 w-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                                                        <X className="h-5 w-5"/>
                                                    </Button>
                                                </motion.div>
                                            ))}
                                            
                                            {pollOptions.length < 4 && (
                                                <Button type="button" size="lg" variant="outline" onClick={handleAddPollOption} className="w-full h-14 rounded-2xl border-dashed border-primary/20 font-black text-[11px] uppercase tracking-widest gap-3 hover:bg-primary/5 hover:border-primary/40 transition-all">
                                                    <PlusCircle className="h-5 w-5 text-primary"/> Add Protocol Option
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="tags-poll" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Registry Tags</Label>
                                        <Input id="tags-poll" value={tags} onChange={e => setTags(e.target.value)} placeholder="vote, reform, community" className="h-14 glass border-primary/5 rounded-2xl font-bold px-5" />
                                    </div>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>

                        <div className="pt-10 border-t border-primary/10">
                            <Button type="submit" disabled={isPosting} className="w-full h-16 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-[1.5rem] active:scale-[0.98] transition-all group overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {isPosting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Transmitting Node Data...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Initialize Community Transmission
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                
                <CardFooter className="bg-muted/5 p-8 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/50 border border-primary/5">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Data Sovereignty</p>
                            <p className="text-[9px] font-bold text-muted-foreground">Your input is encrypted and subject to community standards.</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
