
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useStore(state => state.currentUser);
  const addGroup = useStore(state => state.addGroup);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  
  const handleAddMember = () => {
    if (!memberName.trim()) return;
    
    // Create a new member
    const newMember = {
      id: `member-${Date.now()}`,
      name: memberName.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberName.trim()}`
    };
    
    setMembers([...members, newMember]);
    setMemberName('');
  };
  
  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "User not found",
        description: "Please set up your profile first",
        variant: "destructive",
      });
      return;
    }
    
    // Create the group
    const groupId = addGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      members: [currentUser, ...members],
      createdBy: currentUser.id
    });
    
    toast({
      title: "Group created",
      description: "Your new group has been created successfully",
      variant: "default",
    });
    
    // Navigate to the group
    navigate(`/group/${groupId}`);
  };
  
  return (
    <Layout title="Create Group" showBack>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Roommates, Road Trip"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="What is this group for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add Members
              </label>
              
              <div className="flex">
                <Input
                  placeholder="Member name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="mr-2"
                />
                <Button 
                  type="button" 
                  onClick={handleAddMember}
                  disabled={!memberName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Current user (you) */}
            {currentUser && (
              <div className="p-3 bg-muted rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
                    <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">You</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Added members */}
            {members.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Members</p>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div 
                      key={member.id}
                      className="p-3 bg-card border rounded-md flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          {member.avatar && <AvatarImage src={member.avatar} />}
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p>{member.name}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Group
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CreateGroup;
