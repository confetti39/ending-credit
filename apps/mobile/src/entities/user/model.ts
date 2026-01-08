export interface Profile {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProfileUpdateParams = Partial<
  Pick<Profile, "nickname" | "profileImageUrl" | "bio">
>;
