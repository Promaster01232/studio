'use client';

import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  PlusCircle, 
  Loader2, 
  ListPlus, 
  X, 
  Edit, 
  Send, 
  Link as LinkIcon, 
  ImageUp, 
  ArrowRight, 
  User, 
  MoreVertical, 
  Trash2, 
  Flag,
  Activity,
  BadgeCheck,
  ShieldCheck
} from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    image?: string;
    link?: string;
    poll?: {
        options: { text: string; votes: number }[];
        voters?: string[];
    };
    likes: number;
    likedBy?: string[];
    comments: number;
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll';
    tags?: string[];
    isAnonymous?: boolean;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    photoURL?: string;
    email?: string;
    isAdmin?: boolean;
}

function AuthorIdentityNode({ post, isAdmin }: { post: Post, isAdmin: boolean }) {
    const authorName = post.isAnonymous ? 'Anonymous' : post.authorName;
    const authorAvatar = post.isAnonymous ? undefined : post.authorAvatar;
    const fallback = post.isAnonymous ? 'A' : (post.authorName?.charAt(0) || '');

    return (
        <Link 
            href={post.isAnonymous ? "#" : `/dashboard/profile/${post.authorUid}`} 
            className={cn(
                "flex items-start gap-4 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-12 w-12 border-2 border-background shadow-xl rounded-2xl group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                    <p className="font-black text-sm tracking-tight group-hover/author:text-primary transition-colors underline decoration-primary/0 group-hover/author:decoration-primary/30 underline-offset-4">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile }: { post: Post, userProfile: UserProfile | null }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isVoting, setIsVoting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    const isAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || userProfile?.isAdmin);
    
    const handleAction = (action: string) => {
        toast({
            title: `Action: ${action}`,
            description: "This feature is for institutional demonstration purposes.",
        });
    };

    const handleLike = () => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Registry Access Required', description: 'Authenticate your node to interact with community transmissions.' });
            return;
        }
        if (isLiking) return;
        setIsLiking(true);

        const postRef = doc(firestore, "posts", post.id);

        setOptimisticLikes(prev => userHasLiked ? prev - 1 : prev + 1);
        setOptimisticLikedBy(prev => {
            if (userHasLiked) {
                return prev.filter(uid => uid !== currentUser.uid);
            } else {
                return [...prev, currentUser.uid];
            }
        });

        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).catch((serverError) => {
            setOptimisticLikes(post.likes);
            setOptimisticLikedBy(post.likedBy || []);
            
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'update',
                requestResourceData: { likes: '...', likedBy: '...' },
            }, serverError);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => {
            setIsLiking(false);
        });
    };


    const handleVote = (optionIndex: number) => {
        if (!currentUser || !optimisticPoll || isVoting) return;

        const userHasVoted = optimisticPoll.voters?.includes(currentUser.uid);
        if (userHasVoted) {
            toast({ title: "Protocol Refused", description: "Your registry node has already submitted a vote for this poll." });
            return;
        }

        setIsVoting(true);

        const postRef = doc(firestore, "posts", post.id);
        const newOptions = [...optimisticPoll.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], votes: newOptions[optionIndex].votes + 1 };
        
        const newPollState = {
            ...optimisticPoll,
            options: newOptions,
            voters: [...(optimisticPoll.voters || []), currentUser.uid]
        };

        setOptimisticPoll(newPollState);

        updateDoc(postRef, { poll: newPollState })
            .catch((serverError) => {
                setOptimisticPoll(post.poll);
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'update',
                    requestResourceData: { poll: newPollState },
                }, serverError);
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsVoting(false);
            });
    };

    const handleDeletePost = () => {
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef)
            .then(() => {
                toast({ title: "Post Purged", description: "The content has been erased from the community registry." });
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'delete',
                }, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });
    };

    const handleReportPost = () => {
        toast({ title: "Post Reported", description: "Our forensic moderation team will review this content for statutory violations." });
    };

    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    
    return (
        <Card key={post.id} className="overflow-hidden glass border-primary/5 hover:border-primary/20 transition-all shadow-lg rounded-[2rem]">
            <CardContent className="p-4 sm:p-8 pb-0">
                <div className="flex items-start justify-between mb-6">
                    <AuthorIdentityNode post={post} isAdmin={isAdmin || false} />
                    <div className="flex items-center gap-2">
                        {post.postType && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest h-5">
                                {post.postType}
                            </Badge>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/5">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/5">
                                {(isAuthor || isAdmin) ? (
                                    <DropdownMenuItem onClick={handleDeletePost} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> Purge Post
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={handleReportPost} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                        <Flag className="h-4 w-4" /> Report Content
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <h3 className="text-xl sm:text-2xl font-black font-headline leading-tight tracking-tighter text-foreground">{post.title}</h3>
                    {post.content && <p className="text-muted-foreground text-sm font-medium leading-relaxed whitespace-pre-line">{post.content}</p>}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-muted/30 border-primary/5 text-[9px] font-bold px-3 py-0.5 rounded-lg">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="p-4 sm:px-8 sm:pb-0 sm:pt-6">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-2 block p-4 rounded-2xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all group shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-background shadow-sm">
                                <LinkIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-black truncate text-foreground group-hover:text-primary tracking-tight">{post.link}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    </a>
                )}
                
                {post.image && (
                    <div className="relative aspect-video mt-6 rounded-[1.5rem] overflow-hidden border border-primary/5 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                )}
                
                {optimisticPoll && (
                    <div className="pt-6 space-y-3">
                       {optimisticPoll.options.map((option, index) => {
                           const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                           const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                           return (
                            <Button 
                                key={index} 
                                variant="ghost" 
                                className={cn(
                                    "w-full justify-start h-auto p-4 flex flex-col items-start relative overflow-hidden rounded-xl border border-primary/5 transition-all",
                                    userVotedForThis ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 hover:bg-muted/40'
                                )}
                                onClick={() => handleVote(index)}
                                disabled={userHasVotedOnPoll || isVoting}
                            >
                                <div className="flex items-center justify-between w-full z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all", userVotedForThis ? "border-primary" : "border-muted-foreground/30")}>
                                            {userVotedForThis && <div className="h-2 w-2 bg-primary rounded-full" />}
                                        </div>
                                        <span className="font-black text-sm tracking-tight">{option.text}</span>
                                        {isVoting && userVotedForThis && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                                    </div>
                                    {userHasVotedOnPoll && <span className="text-xs font-black font-mono text-primary">{votePercentage.toFixed(0)}%</span>}
                                </div>
                               {userHasVotedOnPoll && (
                                   <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-1000 ease-out" style={{width: `${votePercentage}%`}}></div>
                               )}
                           </Button>
                       )})}
                    </div>
                )}
            </div>

            <CardFooter className="p-4 sm:p-6 mt-4 flex justify-between items-center bg-muted/5 border-t border-primary/5">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-500/10 hover:text-red-500" onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Heart className={cn("h-4 w-4 transition-all", userHasLiked && "fill-red-500 text-red-500 scale-110")} />}
                        <span>{optimisticLikes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary" onClick={() => handleAction('Comment')}>
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all" onClick={() => handleAction('Share')}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all" onClick={() => handleAction('Bookmark')}>
                    <Bookmark className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResearchAnalyticsPage() {
    const { toast } = useToast();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    
    const [activeTab, setActiveTab] = useState('idea');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [postType, setPostType] = useState('Idea');
    const [tags, setTags] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const firestore = useFirestore();
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    
    const postsUnsubscribeRef = useRef<(() => void) | null>(null);
    
    useEffect(() => {
        if (!firestore || !auth) return;

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            setIsAuthenticated(!!user);

            if (postsUnsubscribeRef.current) {
                postsUnsubscribeRef.current();
                postsUnsubscribeRef.current = null;
            }

            if (!user) {
                setLoading(false);
                setFeed([]);
                setUserProfile(null);
                return;
            }

            setLoading(true);
            const userDocRef = doc(firestore, "users", user.uid);
            getDoc(userDocRef).then(userDoc => {
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            });

            const postsCollection = collection(firestore, "posts");
            const q = query(postsCollection, orderBy("createdAt", "desc"));

            postsUnsubscribeRef.current = onSnapshot(q,
                (querySnapshot) => {
                    const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
                    setFeed(postsData);
                    setLoading(false);
                },
                (serverError) => {
                    if (auth.currentUser) {
                        const permissionError = new FirestorePermissionError({
                            path: postsCollection.path,
                            operation: 'list',
                        }, serverError);
                        errorEmitter.emit('permission-error', permissionError);
                    }
                    setLoading(false);
                    setFeed([]);
                }
            );
        });

        return () => {
            unsubscribeAuth();
            if (postsUnsubscribeRef.current) {
                postsUnsubscribeRef.current();
            }
        };
    }, [auth, firestore]);
    
    const resetDialog = () => {
        setTitle('');
        setContent('');
        setLink('');
        setImagePreview(null);
        setPollOptions(['', '']);
        if(imageInputRef.current) imageInputRef.current.value = '';
        setActiveTab('idea');
        setPostType('Idea');
        setTags('');
        setIsAnonymous(false);
        setPollQuestion('');
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
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

    const handlePostSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

        const newPostData: Omit<Post, 'id' | 'createdAt'> = {
            authorUid: auth.currentUser.uid,
            authorName: isAnonymous ? 'Anonymous' : `${userProfile.firstName} ${userProfile.lastName}`,
            authorAvatar: isAnonymous ? undefined : (userProfile.photoURL || ''),
            title: finalTitle,
            content: isPoll ? '' : content,
            link: isPoll ? '' : link,
            likes: 0,
            likedBy: [],
            comments: 0,
            postType: isPoll ? 'Poll' : (postType as any),
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            isAnonymous: isAnonymous,
        };

        if (!isPoll && imagePreview) {
            newPostData.image = imagePreview;
        }

        if (isPoll) {
            const validPollOptions = pollOptions.map(opt => opt.trim()).filter(Boolean);
            if (validPollOptions.length < 2) {
                toast({ variant: 'destructive', title: 'Invalid Poll', description: 'A poll must have at least two options.' });
                setIsPosting(false);
                return;
            }
            newPostData.poll = {
                options: validPollOptions.map(opt => ({ text: opt, votes: 0 })),
                voters: []
            };
        }

        const postsCollection = collection(firestore, "posts");
        const postToSave = {
          ...newPostData,
          createdAt: serverTimestamp(),
        };

        addDoc(postsCollection, postToSave)
          .then(() => {
            setIsDialogOpen(false);
            resetDialog();
            toast({ title: "Post Published!", description: "Your new post has been added to the feed." });
          })
          .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: postsCollection.path,
              operation: 'create',
              requestResourceData: postToSave,
            }, serverError);
            errorEmitter.emit('permission-error', permissionError);
          })
          .finally(() => {
            setIsPosting(false);
          });
    };
    
    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Community Feed & News" description="Discuss legal topics and stay informed." />
                <Skeleton className="h-24 w-full" />
                <div className="max-w-3xl mx-auto space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </CardContent>
                            <CardFooter className="p-2 sm:p-3">
                                <Skeleton className="h-8 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <PageHeader title="Community Registry Feed" description="Institutional forum for legal news, idea synchronization, and statutory discussions." />
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if(!open) resetDialog();
                setIsDialogOpen(open);
            }}>
                <Card className="glass border-primary/10 shadow-xl rounded-[2rem] overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-lg rounded-2xl shrink-0">
                                {userProfile?.photoURL ? (
                                    <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} className="object-cover" />
                                ) : (
                                    <AvatarFallback className="font-black bg-primary/10 text-primary">
                                        {userProfile ? (
                                            `${userProfile.firstName?.charAt(0) || ''}${userProfile.lastName?.charAt(0) || ''}`
                                        ) : (
                                            <User className="h-5 w-5"/>
                                        )}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                             <DialogTrigger asChild>
                                <button 
                                    disabled={!isAuthenticated}
                                    className="w-full text-left bg-muted/40 hover:bg-muted/60 text-muted-foreground font-bold rounded-2xl px-6 py-4 transition-all text-sm shadow-inner border border-primary/5 active:scale-[0.99]"
                                >
                                    Initialize new post... Share ideas or start a community poll.
                                </button>
                            </DialogTrigger>
                             <DialogTrigger asChild>
                                <Button disabled={!isAuthenticated} size="icon" className="h-12 w-12 rounded-2xl shrink-0 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                    <PlusCircle className="h-6 w-6"/>
                                    <span className="sr-only">Initialize Node</span>
                                </Button>
                            </DialogTrigger>
                        </div>
                    </CardContent>
                </Card>

                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-card">
                    <div className="bg-primary/5 p-8 border-b border-primary/5">
                        <DialogHeader className="p-0 border-none mb-0 text-left">
                            <div className="flex items-center gap-3 mb-1">
                                <PlusCircle className="h-5 w-5 text-primary" />
                                <DialogTitle className="font-headline font-black text-2xl tracking-tighter">Initialize Registry Post</DialogTitle>
                            </div>
                            <DialogDescription className="font-medium text-xs">
                                Disseminate ideas, queries, or suggestions to the institutional community.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    
                    <form onSubmit={handlePostSubmit} className="p-8 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/20 p-1 rounded-xl mb-6">
                                <TabsTrigger value="idea" className="font-black text-[10px] uppercase tracking-widest rounded-lg data-[state=active]:shadow-lg"><Edit className="mr-2 h-3.5 w-3.5"/>Text Entry</TabsTrigger>
                                <TabsTrigger value="poll" className="font-black text-[10px] uppercase tracking-widest rounded-lg data-[state=active]:shadow-lg"><ListPlus className="mr-2 h-3.5 w-3.5"/>Community Poll</TabsTrigger>
                            </TabsList>
                            
                            <div className="mb-6">
                                    <div className="flex items-center justify-between rounded-2xl border border-primary/5 bg-primary/5 p-4 transition-all hover:bg-primary/10">
                                    <div className="space-y-0.5 text-left">
                                        <Label htmlFor="anonymous-idea" className="text-sm font-black tracking-tight">Identity Masking</Label>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Hide username from public registry.</p>
                                    </div>
                                    <Switch id="anonymous-idea" checked={isAnonymous} onCheckedChange={setIsAnonymous} className="data-[state=checked]:bg-primary" />
                                </div>
                            </div>

                            <TabsContent value="idea" className="mt-0 space-y-6 text-left">
                                <div className="space-y-2">
                                    <Label htmlFor="postType" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Transmission Type</Label>
                                    <Select value={postType} onValueChange={setPostType}>
                                        <SelectTrigger id="postType" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                            <SelectItem value="Idea" className="font-bold">Institutional Idea</SelectItem>
                                            <SelectItem value="Question" className="font-bold">Forensic Query</SelectItem>
                                            <SelectItem value="Suggestion" className="font-bold">Statutory Suggestion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 text-left">Headlines</Label>
                                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Concise transmission title" required className="h-12 glass border-primary/5 rounded-xl font-bold px-4" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 text-left">Body Narration</Label>
                                    <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Elaborate on your idea or query..." rows={5} className="glass border-primary/5 rounded-2xl font-medium text-sm p-4 resize-none" />
                                </div>
                                
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl transition-all group-hover:bg-primary/10 border border-primary/10 border-dashed group-hover:border-primary/30 pointer-events-none"></div>
                                    <Label htmlFor="thumbnail" className="cursor-pointer flex flex-col items-center justify-center h-32 gap-3 relative z-10">
                                        <ImageUp className="h-8 w-8 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="text-center">
                                            <p className="text-[11px] font-black text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest">Attach Visual Dossier</p>
                                            <p className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase">Optional image node</p>
                                        </div>
                                    </Label>
                                    <Input id="thumbnail" type="file" onChange={handleImageChange} ref={imageInputRef} accept="image/*" className="hidden"/>
                                </div>

                                {imagePreview && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-2 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                                        <Image src={imagePreview} alt="Image preview" width={500} height={300} className="object-cover w-full aspect-video" />
                                        <Button variant="destructive" size="icon" className="absolute top-3 right-3 h-8 w-8 rounded-xl shadow-2xl" onClick={() => { setImagePreview(null); if(imageInputRef.current) imageInputRef.current.value = ''; }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                                    <div className="space-y-2">
                                    <Label htmlFor="link" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 text-left">External Reference</Label>
                                    <div className="relative">
                                        <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://registry.link" className="h-12 glass border-primary/5 rounded-xl font-bold pl-10" />
                                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-20" />
                                    </div>
                                </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 text-left">Dossier Tags</Label>
                                    <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="policy, statutory, reform" className="h-12 glass border-primary/5 rounded-xl font-bold px-4" />
                                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Comma-separated registry labels.</p>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="poll" className="mt-0 space-y-6 text-left">
                                    <div className="space-y-2">
                                    <Label htmlFor="pollQuestion" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Polling Question</Label>
                                    <Input id="pollQuestion" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="What is your query for the community?" required={activeTab === 'poll'} className="h-12 glass border-primary/5 rounded-xl font-bold px-4" />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Response Options</Label>
                                    <div className="space-y-3">
                                        {pollOptions.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="flex-1 relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary/40">{index + 1}</span>
                                                    <Input 
                                                        placeholder={`Option protocol ${index + 1}`}
                                                        value={option}
                                                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                                        required={activeTab === 'poll'}
                                                        className="h-12 glass border-primary/5 rounded-xl font-bold pl-10"
                                                    />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePollOption(index)} disabled={pollOptions.length <= 2} className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                        {pollOptions.length < 4 && (
                                            <Button type="button" size="sm" variant="outline" onClick={handleAddPollOption} className="w-full h-12 rounded-xl border-dashed border-primary/20 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all">
                                                <PlusCircle className="h-4 w-4"/>Add Protocol Node
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags-poll" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Dossier Tags</Label>
                                    <Input id="tags-poll" value={tags} onChange={e => setTags(e.target.value)} placeholder="vote, reform, technology" className="h-12 glass border-primary/5 rounded-xl font-bold px-4" />
                                </div>
                            </TabsContent>
                        </Tabs>
                        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
                            <Button type="submit" disabled={isPosting} className="w-full h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 rounded-2xl active:scale-95 transition-all">
                                {isPosting ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Send className="mr-3 h-5 w-5" />}
                                Initialize Transmission
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between flex-wrap gap-6 border-b border-primary/5 pb-6">
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-black font-headline tracking-tighter">Live Registry Stream</h2>
                </div>
                <div className="flex flex-wrap bg-muted/30 p-1 rounded-xl border border-primary/5">
                    {["All", "Idea", "Poll", "Question", "Suggestion"].map((f) => (
                        <Button key={f} variant="ghost" size="sm" className="h-8 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-background transition-all">
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-8 max-w-3xl mx-auto">
                {!isAuthenticated && !loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="glass border-primary/10 rounded-[2.5rem] py-20 text-center">
                            <CardContent className="space-y-4">
                                <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                                    <Flag className="h-12 w-12 text-primary opacity-20" />
                                </div>
                                <p className="font-black text-xl tracking-tighter uppercase">Clearance Required</p>
                                <p className="text-muted-foreground text-xs font-medium max-w-xs mx-auto">Authenticate your registry node to access and contribute to the community feed.</p>
                                <Button asChild className="mt-4 rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-8 shadow-xl shadow-primary/20">
                                    <Link href="/login">Initialize Sign In</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : feed.length === 0 && !loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="glass border-primary/10 rounded-[2.5rem] py-20 text-center">
                            <CardContent className="space-y-4">
                                <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                                    <MessageCircle className="h-12 w-12 text-primary opacity-20" />
                                </div>
                                <p className="font-black text-xl tracking-tighter uppercase">Registry Empty</p>
                                <p className="text-muted-foreground text-xs font-medium italic">"No community transmissions have been initialized in this sector."</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {feed.map((item) => <PostCard key={item.id} post={item} userProfile={userProfile} />)}
                    </div>
                )}
            </div>
        </div>
    );
}