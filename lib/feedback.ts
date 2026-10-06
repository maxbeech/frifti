/**
 * Opens Sentry's feedback form. Kept free of React so it can be unit tested with a fake SDK.
 */
export type FeedbackSdk = {
  getFeedback(): { createForm(): Promise<{ appendToDom(): void; open(): void }> } | undefined;
  setUser(user: { email?: string; username?: string }): void;
};

export async function openFeedbackForm(
  sentry: FeedbackSdk,
  user?: { email?: string | null; name?: string | null },
): Promise<"opened" | "unavailable"> {
  const feedback = sentry.getFeedback();
  if (!feedback) return "unavailable";
  // The form reads name and email from the Sentry user; pre-fill when the app knows them.
  if (user?.email) sentry.setUser({ email: user.email, ...(user.name ? { username: user.name } : {}) });
  const form = await feedback.createForm();
  form.appendToDom();
  form.open();
  return "opened";
}
