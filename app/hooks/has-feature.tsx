import type { Features } from "~/features";
import PostHogClient from "~/services/posthog";
import { getVisitorIdFromRequest } from "~/services/auth/session.server";

/**
 * @name hasFeature
 * @description
 */
export const hasFeature = async (
  request: Request,
  feature: Features
): Promise<boolean> => {
  const visitorId = await getVisitorIdFromRequest(request);
  const pgClient = PostHogClient();
  const isEnabled = await pgClient.isFeatureEnabled(feature, visitorId);
  return !!isEnabled;
};
