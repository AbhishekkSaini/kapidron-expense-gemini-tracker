
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useStore(state => state.currentUser);
  const setCurrentUser = useStore(state => state.setCurrentUser);
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentUser({
      id: currentUser?.id || 'user1',
      name: name.trim(),
      email: email.trim() || undefined,
      avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
      variant: "default",
    });
  };
  
  const handleLogout = () => {
    // In a real app, this would clear authentication
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };
  
  return (
    <Layout title="Profile" showBack>
      <Card className="mb-6">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              {currentUser?.avatar && <AvatarImage src={currentUser.avatar} />}
              <AvatarFallback className="text-2xl">
                {currentUser?.name.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Info className="mr-2 h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Expense Tracker App v1.0
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Profile;
