import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary to-primary-hover p-4 rounded-full inline-block mb-4">
            <Plane className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Flight Path Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The aviation route you're looking for doesn't exist in our flight plan.
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = "/"}
          className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-[var(--shadow-aviation)]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Control Tower
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
