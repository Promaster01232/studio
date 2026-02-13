"use client";

import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import { Heart, MessageCircle, Share2, Bookmark, PlusCircle, Loader2 } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, getDoc, doc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    image?: {
        imageUrl: string;
        imageHint: string;
    };
    likes: number;
    comments: number;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    photoURL?: string;
}

export default function ResearchAnalyticsPage() {
    const { toast } = useToast();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    
    const firestore = useFirestore();
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!firestore) return;
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
        if (auth?.currentUser && firestore) {
          const userDocRef = doc(firestore, "users", auth.currentUser.uid);
          getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            }
          });
        }
      }, [auth, firestore]);


    const handleAction = (action: string) => {
        toast({
            title: `Post ${action.toLowerCase()}ed!`,
            description: "This is for demonstration purposes.",
        });
    };

    const handlePostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!auth?.currentUser || !firestore || !userProfile) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to create a post.'
            });
            return;
        }

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            toast({
                variant: 'destructive',
                title: 'Missing fields',
                description: 'Please fill out both title and content.'
            });
            return;
        }
        
        setIsPosting(true);

        try {
            await addDoc(collection(firestore, "posts"), {
                authorUid: auth.currentUser.uid,
                authorName: `${userProfile.firstName} ${userProfile.lastName}`,
                authorAvatar: userProfile.photoURL || '',
                title,
                content,
                createdAt: serverTimestamp(),
                likes: 0,
                comments: 0
            });
            setIsDialogOpen(false);
            toast({
                title: "Post Published!",
                description: "Your new post has been added to the feed."
            });
        } catch (error) {
            console.error("Error creating post:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not publish your post. Please try again later.'
            });
        } finally {
            setIsPosting(false);
        }
    };
    
    // SKELETON LOADER
    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Legal News & Updates"
                    description="Stay informed with the latest legal news and notifications."
                >
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
            <PageHeader
                title="Legal News & Updates"
                description="Stay informed with the latest legal news and notifications."
            >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create a New Post</DialogTitle>
                            <DialogDescription>
                                Share a legal news update with the community. Click post when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePostSubmit}>
                          <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input id="title" name="title" placeholder="Your post title" required disabled={isPosting} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="content">Content</Label>
                                  <Textarea id="content" name="content" placeholder="Write your news update here..." required rows={5} disabled={isPosting} />
                              </div>
                          </div>
                          <DialogFooter>
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
                ) : feed.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-10 w-10 border hover:ring-2 hover:ring-primary transition-all">
                                        {item.authorAvatar && <AvatarImage src={item.authorAvatar} alt={item.authorName}/>}
                                        <AvatarFallback>{item.authorName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{item.authorName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.createdAt ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) : '...'}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold font-headline leading-snug mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.content}</p>
                            </div>
                            
                            {item.image && (
                                <div className="relative aspect-video">
                                     <Image
                                        src={item.image.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={item.image.imageHint}
                                    />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-2 sm:p-3 flex justify-between items-center">
                           <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Like')}>
                                    <Heart className="h-4 w-4" />
                                    <span className="text-xs text-muted-foreground">{item.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Comment')}>
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-xs text-muted-foreground">{item.comments}</span>
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
                ))}
            </div>
        </div>
    );
}
