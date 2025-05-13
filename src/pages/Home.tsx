
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Link, useNavigate } from "react-router-dom";
import { Computer, User, Wifi, Moon, Sun } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-primary">معلم الشطرنج</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === "light" ? "التبديل للوضع الداكن" : "التبديل للوضع المضيء"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          {user ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm hidden sm:inline">مرحباً، {user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>تسجيل الخروج</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")}>تسجيل الدخول</Button>
          )}
        </div>
      </header>

      <main className="flex-1 container max-w-4xl py-8 px-4 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">معلم الشطرنج</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            العب الشطرنج مع الأصدقاء محلياً، تحدى الكمبيوتر، أو العب عبر الإنترنت مع الآخرين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <User size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">اللعب المحلي</h2>
              <p className="text-muted-foreground mb-6 text-center">
                العب مع صديق على نفس الجهاز، بالتناوب.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/play/local")}
              >
                لعب محلي
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <Computer size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">اللعب ضد الكمبيوتر</h2>
              <p className="text-muted-foreground mb-6 text-center">
                تحدى الذكاء الاصطناعي وطور مهاراتك.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/play/computer")}
              >
                تحدي الكمبيوتر
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <Wifi size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">اللعب عبر الإنترنت</h2>
              <p className="text-muted-foreground mb-6 text-center">
                أنشئ لعبة وادعُ أصدقائك عبر رابط قابل للمشاركة.
              </p>
              {user ? (
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/play/online")}
                >
                  اللعب عبر الإنترنت
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => navigate("/login")}
                >
                  سجل الدخول للعب عبر الإنترنت
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">حول معلم الشطرنج</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            معلم الشطرنج هو تطبيق شطرنج جميل وحديث يتيح لك لعب الشطرنج بعدة طرق.
            مع تصميم أنيق، وضوابط بديهية، وأوضاع لعب متعددة، إنه الطريقة المثالية للاستمتاع بلعبة الشطرنج الخالدة.
          </p>
        </div>
      </main>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} معلم الشطرنج. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
