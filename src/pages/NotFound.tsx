
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground max-w-md">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home size={16} /> العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}
