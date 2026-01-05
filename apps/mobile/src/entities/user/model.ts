export interface Profile {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProfileUpdateParams = Partial<
  Pick<Profile, "nickname" | "profileImageUrl" | "bio">
>;
