import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { login, getSession, guestLogin } from "@/lib/auth";
import { z } from "zod";
import { User } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255, "האימייל ארוך מדי"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים").max(128, "הסיסמה ארוכה מדי"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      loginSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    
    try {
      const { user } = await login(email.trim(), password);
      toast.success("התחברת בהצלחה!");
      
      // Check if this is a new user (first login)
      if (user?.created_at) {
        const createdDate = new Date(user.created_at);
        const now = new Date();
        const diffInMinutes = (now.getTime() - createdDate.getTime()) / (1000 * 60);
        
        // If account was created in the last 5 minutes, redirect to install
        if (diffInMinutes < 5) {
          navigate("/install");
          return;
        }
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("אימייל או סיסמה שגויים");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("יש לאמת את כתובת האימייל שלך לפני ההתחברות");
      } else {
        toast.error("שגיאה בהתחברות. נסה שוב.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setGuestLoading(true);
    
    try {
      await guestLogin();
      toast.success("נכנסת כאורח! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Guest login error:", error);
      if (error.message.includes("Anonymous sign-ins are disabled")) {
        toast.error("כניסת אורחים לא זמינה כרגע");
      } else {
        toast.error("שגיאה בכניסה כאורח. נסה שוב.");
      }
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">התחברות</CardTitle>
          <CardDescription>היכנס לחשבון שלך</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || guestLoading}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                placeholder="לפחות 8 תווים"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || guestLoading}
                className="text-right"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || guestLoading}
            >
              {loading ? "מתחבר..." : "התחבר"}
            </Button>
            
            <div className="relative w-full">
              <Separator className="my-2" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                או
              </span>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleGuestAccess}
              disabled={loading || guestLoading}
            >
              <User className="h-4 w-4" />
              {guestLoading ? "נכנס..." : "כניסה כאורח (דמו)"}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              אין לך חשבון?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                הרשם כאן
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
