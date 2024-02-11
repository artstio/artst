import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export default function PostHogClient() {
	if (!posthogClient) {
		posthogClient = new PostHog(process.env.POSTHOG_TOKEN, {
			host: process.env.POSTHOG_API,
		});
	}
	return posthogClient;
}
