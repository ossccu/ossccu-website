import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface UploadAvatarResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const storageService = {
  async uploadAvatar(file: File, userId: string): Promise<UploadAvatarResult> {
    // 1. Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Image size exceeds 5MB limit." };
    }

    // 2. Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: "Only PNG, JPEG, and WebP images are supported." };
    }

    const ext = file.name.split(".").pop() || "png";
    const filePath = `${userId}/${Date.now()}.${ext}`;

    // 3. If Supabase is configured and connected, upload to Supabase Storage
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          console.warn("Supabase storage upload error:", uploadError);
        } else {
          const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
          if (data?.publicUrl) {
            return { success: true, url: data.publicUrl };
          }
        }
      } catch (err: any) {
        console.warn("Storage exception, using fallback:", err);
      }
    }

    // 4. Local / Offline fallback: Convert to Base64 Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, error: "Failed to read image file." });
      };
      reader.readAsDataURL(file);
    });
  },
};
