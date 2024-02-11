import type { Features } from "~/features";
import { getVisitorIdFromRequest } from "~/services/auth/session.server";
import PostHogClient from "~/services/posthog";

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
