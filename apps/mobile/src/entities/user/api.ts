import { supabase } from "../../../lib/supabase";
import { Profile, ProfileUpdateParams } from "./model";

export const userApi = {
  /**
   * 내 프로필 정보를 가져옵니다.
   */
  getMyProfile: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    // Map snake_case DB to camelCase Model
    return {
      id: data.id,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url || undefined,
      bio: data.bio || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Profile;
  },

  /**
   * 내 프로필 정보를 업데이트합니다.
   */
  updateMyProfile: async (params: ProfileUpdateParams) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Map camelCase Params to snake_case DB
    const updates: any = {};
    if (params.nickname !== undefined) updates.nickname = params.nickname;
    if (params.profileImageUrl !== undefined)
      updates.profile_image_url = params.profileImageUrl;
    if (params.bio !== undefined) updates.bio = params.bio;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url || undefined,
      bio: data.bio || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Profile;
  },

  /**
   * 닉네임 중복 여부를 확인합니다.
   * (현재는 간단히 count로 체크, 추후 RPC나 별도 API로 변경 가능)
   */
  checkNicknameAvailability: async (nickname: string) => {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("nickname", nickname);

    if (error) throw error;
    return count === 0;
  },

  /**
   * 프로필 이미지를 업로드합니다.
   */
  uploadProfileImage: async (uri: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const ext = uri.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: path,
      type: `image/${ext === "png" ? "png" : "jpeg"}`,
    } as any);

    const { data, error } = await supabase.storage
      .from("user-images")
      .upload(path, formData, {
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("user-images")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  },
};
