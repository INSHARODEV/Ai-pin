export const logout = () => {
  // 1) Clear client storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  // 2) Clear cookies used by middleware
  // Use the SAME Path/Domain/SameSite/Secure attributes you used when setting them.
  // (You set Path=/ and SameSite=Lax earlier.)
  document.cookie = `token=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax`;
  // (Optional) Wider compatibility:
  document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  //   // 3) Navigate; replace to avoid back to protected page
  //   // Force re-evaluation (middleware runs on the target route)
  //   toast.success('Logged out');
  // Hard replace ensures no bfcache artifacts:
  window.location.replace('/login');
};
