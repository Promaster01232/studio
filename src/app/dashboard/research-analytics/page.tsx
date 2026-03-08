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
import { Heart, MessageCircle, Share2, Bookmark, PlusCircle, Loader2, ListPlus, X, Edit, Send, Link as LinkIcon, ImageUp, ArrowRight, User } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";


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
}

function PostCard({ post }: { post: Post }) {
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
    
    const authorName = post.isAnonymous ? 'Anonymous' : post.authorName;
    const authorAvatar = post.isAnonymous ? undefined : post.authorAvatar;
    const fallback = post.isAnonymous ? 'A' : (post.authorName?.charAt(0) || '');
    
    const handleAction = (action: string) => {
        toast({
            title: `Action: ${action}`,
            description: "This feature is for demonstration purposes.",
        });
    };

    const handleLike = () => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'You must be logged in to like a post.' });
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
            toast({ title: "You have already voted on this poll." });
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

    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    
    return (
        <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6 pb-0">
                <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10 border hover:ring-2 hover:ring-primary transition-all">
                        {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName}/>}
                        <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold">{authorName}</p>
                        <p className="text-xs text-muted-foreground">
                            {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                        </p>
                    </div>
                     {post.postType && (
                        <Badge variant="outline" className="hidden sm:inline-flex">{post.postType}</Badge>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-bold font-headline leading-snug">{post.title}</h3>
                    {post.content && <p className="text-muted-foreground text-sm whitespace-pre-line">{post.content}</p>}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="p-4 sm:px-6 sm:pb-0 sm:pt-4">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-2 block p-3 rounded-lg border bg-muted/30 hover:bg-muted/70 transition-colors group">
                        <div className="flex items-center gap-3">
                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary">{post.link}</p>
                            </div>
                        </div>
                    </a>
                )}
                
                {post.image && (
                    <div className="relative aspect-video mt-4 rounded-lg overflow-hidden border">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                
                {optimisticPoll && (
                    <div className="pt-4 space-y-3">
                       {optimisticPoll.options.map((option, index) => {
                           const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                           const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                           return (
                            <Button 
                                key={index} 
                                variant={userVotedForThis ? 'secondary' : 'outline'} 
                                className="w-full justify-start h-auto p-3 flex flex-col items-start relative overflow-hidden"
                                onClick={() => handleVote(index)}
                                disabled={userHasVotedOnPoll || isVoting}
                            >
                                <div className="flex items-center justify-between w-full z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{option.text}</span>
                                        {isVoting && userVotedForThis && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                                    </div>
                                    {userVotedForThis && <span className="text-xs font-bold">{votePercentage.toFixed(0)}%</span>}
                                </div>
                               {userVotedForThis && (
                                   <div className="absolute inset-y-0 left-0 bg-primary/10" style={{width: `${votePercentage}%`}}></div>
                               )}
                           </Button>
                       )})}
                    </div>
                )}
            </div>

            <CardFooter className="p-2 sm:p-3 mt-2 flex justify-between items-center">
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Heart className={cn("h-4 w-4", userHasLiked && "fill-red-500 text-red-500")} />}
                        <span className="text-xs text-muted-foreground">{optimisticLikes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Comment')}>
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs text-muted-foreground">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleAction('Share')}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleAction('Bookmark')}>
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

            // Cleanup immediately on auth state change
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
        <div className="space-y-8">
            <PageHeader title="Community Feed & News" description="Discuss legal topics and stay informed." />
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if(!open) resetDialog();
                setIsDialogOpen(open);
            }}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border">
                                {userProfile?.photoURL ? (
                                    <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} />
                                ) : (
                                    <AvatarFallback>
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
                                    className="w-full text-left bg-muted hover:bg-muted/90 text-muted-foreground rounded-full px-4 py-3 transition-colors text-sm"
                                >
                                    What's on your mind? Share news, ideas, or start a poll...
                                </button>
                            </DialogTrigger>
                             <DialogTrigger asChild>
                                <Button disabled={!isAuthenticated} size="icon" className="rounded-full flex-shrink-0">
                                    <PlusCircle className="h-5 w-5"/>
                                    <span className="sr-only">Create Post</span>
                                </Button>
                            </DialogTrigger>
                        </div>
                    </CardContent>
                </Card>

                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create a contribution</DialogTitle>
                        <DialogDescription>
                            Share an idea, ask a question, or start a poll to engage with the community.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePostSubmit}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="idea"><Edit className="mr-2 h-4 w-4"/>Share an Idea</TabsTrigger>
                                <TabsTrigger value="poll"><ListPlus className="mr-2 h-4 w-4"/>Start a Poll</TabsTrigger>
                            </TabsList>
                            
                            <div className="py-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="anonymous-idea" className="text-base">Post Anonymously</Label>
                                        <p className="text-xs text-muted-foreground">Your username and avatar will be hidden from the public.</p>
                                    </div>
                                    <Switch id="anonymous-idea" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                </div>
                            </div>

                            <TabsContent value="idea" className="mt-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postType">Post Type</Label>
                                    <Select value={postType} onValueChange={setPostType}>
                                        <SelectTrigger id="postType"><SelectValue placeholder="Select a type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Idea">Idea</SelectItem>
                                            <SelectItem value="Question">Question</SelectItem>
                                            <SelectItem value="Suggestion">Suggestion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="A short, descriptive title" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Description (Optional)</Label>
                                    <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Describe your idea, question, or suggestion in more detail." rows={4} />
                                </div>
                                
                                <div className="p-4 border-dashed border-2 rounded-lg text-center">
                                    <Label htmlFor="thumbnail" className="cursor-pointer">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <ImageUp className="h-8 w-8" />
                                            <span className="font-medium">Add a thumbnail (Optional)</span>
                                            <span className="text-xs">Click to upload</span>
                                        </div>
                                    </Label>
                                    <Input id="thumbnail" type="file" onChange={handleImageChange} ref={imageInputRef} accept="image/*" className="hidden"/>
                                </div>

                                {imagePreview && (
                                    <div className="relative mt-2">
                                        <Image src={imagePreview} alt="Image preview" width={500} height={300} className="rounded-md object-cover w-full aspect-video" />
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => { setImagePreview(null); if(imageInputRef.current) imageInputRef.current.value = ''; }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                    <div className="space-y-2">
                                    <Label htmlFor="link">Add a link (Optional)</Label>
                                    <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com" />
                                </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (Optional)</Label>
                                    <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., saas, ai, fintech" />
                                    <p className="text-xs text-muted-foreground">Comma-separated tags to help categorize your post.</p>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="poll" className="mt-0 space-y-4">
                                    <div className="space-y-2">
                                    <Label htmlFor="pollQuestion">Poll Question</Label>
                                    <Input id="pollQuestion" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="What do you want to ask?" required={activeTab === 'poll'} />
                                </div>
                                <div className="space-y-3">
                                    <Label>Poll Options</Label>
                                    {pollOptions.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{index + 1}.</span>
                                                <Input 
                                                    placeholder={`Option ${index + 1}`}
                                                    value={option}
                                                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                                    required={activeTab === 'poll'}
                                                    className="pl-8"
                                                />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePollOption(index)} disabled={pollOptions.length <= 2}>
                                                <X className="h-4 w-4 text-muted-foreground"/>
                                            </Button>
                                        </div>
                                    ))}
                                    {pollOptions.length < 4 && <Button type="button" size="sm" variant="outline" onClick={handleAddPollOption} className="w-full border-dashed"><PlusCircle className="mr-2 h-4 w-4"/>Add Option</Button>}
                                </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="tags-poll">Tags (Optional)</Label>
                                    <Input id="tags-poll" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., policy, reform, technology" />
                                    <p className="text-xs text-muted-foreground">Comma-separated tags to help categorize your poll.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isPosting} className="w-full h-12">
                                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Publish Post
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">Community Feed</h2>
                <div className="flex flex-wrap gap-2">
                    <Button variant="default" size="sm">All</Button>
                    <Button variant="outline" size="sm">Idea</Button>
                    <Button variant="outline" size="sm">Poll</Button>
                    <Button variant="outline" size="sm">Question</Button>
                    <Button variant="outline" size="sm">Suggestion</Button>
                </div>
            </div>

            <div className="space-y-6">
                {!isAuthenticated && !loading ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <p className="text-muted-foreground">Please log in to view and create posts.</p>
                        </CardContent>
                    </Card>
                ) : feed.length === 0 && !loading ? (
                    <Card>
                        <CardContent className="py-20 text-center text-muted-foreground">
                            No news updates yet. Be the first to post!
                        </CardContent>
                    </Card>
                ) : feed.map((item) => <PostCard key={item.id} post={item} />)}
            </div>
        </div>
    );
}
