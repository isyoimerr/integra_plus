export const profileService = {
  getProfile: async (userId) => ({
    id: userId,
    user_id: userId,
    full_name: null,
    role: 'estudiante',
  }),
};
