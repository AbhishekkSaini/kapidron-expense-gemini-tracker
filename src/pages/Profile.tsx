
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuthStore();
  const { currentUser, setCurrentUser } = useStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [editMode, setEditMode] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: name.trim()
      };
      
      setCurrentUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setEditMode(false);
    }
  };

  const totalGroups = useStore(state => state.groups.length);
  const totalExpenses = useStore(state => state.expenses.length);
  const overallBalance = useStore(state => {
    if (!state.currentUser) return { amount: 0 };
    const userBalances = state.getOverallBalance();
    const userBalance = userBalances.find(b => b.userId === state.currentUser?.id);
    return userBalance ? userBalance : { amount: 0 };
  });

  return (
    <Layout title="Profile" showBack>
      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="shadow-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            {!editMode && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                {currentUser?.avatar && <AvatarImage src={currentUser.avatar} />}
                <AvatarFallback className="text-lg">
                  {currentUser?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {editMode ? (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  {currentUser?.email && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={currentUser.email}
                        disabled
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditMode(false);
                        setName(currentUser?.name || '');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateProfile}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{currentUser?.name}</h3>
                  {currentUser?.email && (
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold">{totalGroups}</p>
                <p className="text-muted-foreground">Groups</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold">{totalExpenses}</p>
                <p className="text-muted-foreground">Expenses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className={overallBalance.amount > 0 ? "bg-destructive/10" : "bg-secondary/5"}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold">
                  ${Math.abs(overallBalance.amount).toFixed(2)}
                </p>
                <p className="text-muted-foreground">
                  {overallBalance.amount > 0 ? 'You Owe' : 'You Get Back'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-4 rounded-none"
                onClick={() => navigate('/summary')}
              >
                <span>View Summary</span>
                <ChevronRight size={18} />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-4 rounded-none"
                onClick={() => navigate('/create-group')}
              >
                <span>Create New Group</span>
                <ChevronRight size={18} />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="px-0">
            <Button 
              variant="ghost" 
              className="w-full text-destructive flex items-center justify-center p-4"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
