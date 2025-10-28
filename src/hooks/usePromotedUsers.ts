import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePromotedUsers = () => {
  return useQuery({
    queryKey: ['promoted-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("promoted", true);

      if (error) {
        console.warn('Failed to load promoted users:', error);
        return [];
      }

      return data?.map((u: any) => u.user_id) || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
