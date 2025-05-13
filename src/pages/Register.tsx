
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التحقق من كلمة المرور والمحاولة مرة أخرى.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      toast({
        title: "تم إنشاء الحساب",
        description: "تم تسجيلك وتسجيل دخولك بنجاح.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: "فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">معلم الشطرنج</h1>
          <p className="mt-2 text-lg text-muted-foreground">إنشاء حساب جديد</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                placeholder="اسم المستخدم"
              />
            </div>
            
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="كلمة المرور"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="تأكيد كلمة المرور"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                لديك حساب بالفعل؟
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "جاري إنشاء الحساب..." : "التسجيل"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
