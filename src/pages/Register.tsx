import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { register, getSession } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255, "האימייל ארוך מדי"),
  password: z.string()
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .max(128, "הסיסמה ארוכה מדי")
    .regex(/[A-Za-z]/, "הסיסמה חייבת להכיל לפחות אות אחת")
    .regex(/[0-9]/, "הסיסמה חייבת להכיל לפחות ספרה אחת"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        // Not logged in, stay on register page
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      registerSchema.parse({ email, password, confirmPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    
    try {
      await register(email.trim(), password);
      toast.success("נרשמת בהצלחה! כעת תועבר לדף ההתחברות.");
      
      // Redirect to login with success message after a brief delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      if (error.message.includes("User already registered")) {
        toast.error("משתמש עם אימייל זה כבר קיים");
      } else if (error.message.includes("Password should be at least")) {
        toast.error("הסיסמה חייבת להכיל לפחות 8 תווים");
      } else {
        toast.error("שגיאה בהרשמה. נסה שוב.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">הרשמה</CardTitle>
          <CardDescription>צור חשבון חדש</CardDescription>
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
                disabled={loading}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                placeholder="לפחות 8 תווים עם אות וספרה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="הקלד את הסיסמה שוב"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="text-right"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "נרשם..." : "הרשם"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              כבר יש לך חשבון?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                התחבר כאן
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
