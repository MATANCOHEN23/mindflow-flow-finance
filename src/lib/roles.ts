import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "user";

export const getUserRole = async (userId: string): Promise<AppRole | null> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }

    return data?.role as AppRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin";
};

export const assignRole = async (userId: string, role: AppRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });

    if (error) {
      console.error("Error assigning role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in assignRole:", error);
    return false;
  }
};
