
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "تم بنجاح",
        description: "تم تسجيل دخولك بنجاح.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في المصادقة",
        description: "بريد إلكتروني أو كلمة مرور غير صحيحة. للتجربة، استخدم بريد إلكتروني يحتوي على 'test'.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">لعبة الشطرنج</h1>
          <p className="mt-2 text-lg text-muted-foreground">تسجيل الدخول إلى حسابك</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="البريد الإلكتروني"
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="كلمة المرور"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                ليس لديك حساب؟
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>لأغراض العرض، استخدم أي بريد إلكتروني يحتوي على "test"</p>
            <p>مثال: test@example.com / password</p>
          </div>
        </form>
      </div>
    </div>
  );
}
