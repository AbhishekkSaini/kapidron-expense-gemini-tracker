
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout showBack>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')}>
          Go Back Home
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
