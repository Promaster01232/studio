
"use client";

import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark, PlusCircle, Loader2, ImagePlus, ListPlus, X, Link as LinkIcon } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, getDoc, doc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    image?: string; // data URL
    link?: string;
    poll?: {
        options: { text: string; votes: number }[];
    };
    likes: number;
    comments: number;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    photoURL?: string;
}

function PostCard({ post }: { post: Post }) {
    const { toast } = useToast();
    
    const handleAction = (action: string) => {
        toast({
            title: `Post ${action.toLowerCase()}ed!`,
            description: "This is for demonstration purposes.",
        });
    };

    const totalVotes = post.poll ? post.poll.options.reduce((acc, option) => acc + option.votes, 0) : 0;


    return (
        <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10 border hover:ring-2 hover:ring-primary transition-all">
                            {post.authorAvatar && <AvatarImage src={post.authorAvatar} alt={post.authorName}/>}
                            <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{post.authorName}</p>
                            <p className="text-xs text-muted-foreground">
                                {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                            </p>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold font-headline leading-snug mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{post.content}</p>
                </div>
                
                {post.link && (
                    <div className="px-4 sm:px-6 pb-4">
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-2 break-all">
                            <LinkIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{post.link}</span>
                        </a>
                    </div>
                )}
                
                {post.image && (
                    <div className="relative aspect-video">
                            <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                
                {post.poll && (
                    <div className="p-4 sm:p-6 space-y-3">
                       {post.poll.options.map((option, index) => (
                           <Button key={index} variant="outline" className="w-full justify-start h-auto p-3">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm">{option.text}</span>
                                    {totalVotes > 0 && <span className="text-xs text-muted-foreground">{((option.votes / totalVotes) * 100).toFixed(0)}%</span>}
                                </div>
                               {totalVotes > 0 && (
                                   <div className="relative h-1 w-full bg-muted rounded-full mt-2">
                                       <div className="absolute h-1 bg-primary rounded-full" style={{width: `${(option.votes / totalVotes) * 100}%`}}></div>
                                   </div>
                               )}
                           </Button>
                       ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-2 sm:p-3 flex justify-between items-center">
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Like')}>
                        <Heart className="h-4 w-4" />
                        <span className="text-xs text-muted-foreground">{post.likes}</span>
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    
    // Dialog state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const firestore = useFirestore();
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        setLoading(true);
        const postsCollection = collection(firestore, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Post));
            setFeed(postsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            toast({
                variant: 'destructive',
                title: 'Error fetching posts',
                description: 'Could not load the news feed. Please check your connection or permissions.'
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, toast]);
    
    useEffect(() => {
        if (auth.currentUser) {
          const userDocRef = doc(firestore, "users", auth.currentUser.uid);
          getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            }
          });
        }
      }, [auth.currentUser, firestore]);

    const resetDialog = () => {
        setTitle('');
        setContent('');
        setLink('');
        setImagePreview(null);
        setShowPollCreator(false);
        setPollOptions(['', '']);
        if(imageInputRef.current) imageInputRef.current.value = '';
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

        if (!title || !content) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out both title and content.' });
            return;
        }
        
        setIsPosting(true);

        const newPost: Omit<Post, 'id' | 'createdAt'> = {
            authorUid: auth.currentUser.uid,
            authorName: `${userProfile.firstName} ${userProfile.lastName}`,
            authorAvatar: userProfile.photoURL || '',
            title,
            content,
            link: link || undefined,
            likes: 0,
            comments: 0,
        };

        if (imagePreview) {
            newPost.image = imagePreview;
        }

        if (showPollCreator && pollOptions.some(opt => opt.trim() !== '')) {
            newPost.poll = {
                options: pollOptions
                    .map(opt => opt.trim())
                    .filter(opt => opt !== '')
                    .map(opt => ({ text: opt, votes: 0 }))
            };
        }

        const postsCollection = collection(firestore, "posts");
        const postData = {
          ...newPost,
          createdAt: serverTimestamp(),
        };

        addDoc(postsCollection, postData)
          .then(() => {
            setIsDialogOpen(false);
            resetDialog();
            toast({ title: "Post Published!", description: "Your new post has been added to the feed." });
          })
          .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: postsCollection.path,
              operation: 'create',
              requestResourceData: postData,
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
                <PageHeader title="Legal News & Updates" description="Stay informed with the latest legal news and notifications.">
                    <Skeleton className="h-10 w-32" />
                </PageHeader>
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
                            <Skeleton className="h-48 w-full" />
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
            <PageHeader title="Legal News & Updates" description="Stay informed with the latest legal news and notifications.">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button> <PlusCircle className="mr-2 h-4 w-4" /> Create Post </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create a New Post</DialogTitle>
                            <DialogDescription> Share a legal news update with the community. Click post when you're done. </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePostSubmit}>
                          <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Your post title" required disabled={isPosting} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="content">Content</Label>
                                  <Textarea id="content" name="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your news update here..." required rows={5} disabled={isPosting} />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="link">Link (Optional)</Label>
                                  <Input id="link" name="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com/news-article" disabled={isPosting} />
                              </div>

                               {imagePreview && (
                                   <div className="relative">
                                       <Image src={imagePreview} alt="Image preview" width={500} height={300} className="rounded-md object-cover w-full aspect-video" />
                                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => { setImagePreview(null); if(imageInputRef.current) imageInputRef.current.value = ''; }}>
                                           <X className="h-4 w-4" />
                                       </Button>
                                   </div>
                               )}
                               
                               {showPollCreator && (
                                   <div className="space-y-3 p-3 border rounded-md">
                                        <Label>Poll Options</Label>
                                       {pollOptions.map((option, index) => (
                                           <div key={index} className="flex items-center gap-2">
                                               <Input 
                                                 placeholder={`Option ${index + 1}`}
                                                 value={option}
                                                 onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                                 disabled={isPosting}
                                               />
                                               <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePollOption(index)} disabled={pollOptions.length <= 2}>
                                                   <X className="h-4 w-4"/>
                                               </Button>
                                           </div>
                                       ))}
                                       {pollOptions.length < 4 && <Button type="button" size="sm" variant="ghost" onClick={handleAddPollOption}>Add Option</Button>}
                                   </div>
                               )}

                          </div>
                          <DialogFooter className="!justify-between">
                            <div className="flex items-center gap-1">
                                <Input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden"/>
                                <Button type="button" variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} disabled={isPosting || !!imagePreview}>
                                    <ImagePlus className="text-muted-foreground"/>
                                </Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPollCreator(prev => !prev)} disabled={isPosting}>
                                    <ListPlus className="text-muted-foreground"/>
                                </Button>
                            </div>
                            <Button type="submit" disabled={isPosting}>
                                {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post
                            </Button>
                          </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            <div className="max-w-3xl mx-auto space-y-6">
                {feed.length === 0 ? (
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
