// import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';

import { Form, useFetcher } from "@remix-run/react";

import { Icons } from "~/components/shared/icons";
import { Button, buttonVariants } from "~/components/ui/button";
// import { userAuthSchema } from '@/lib/validations/auth';
import { Input, InputWithLabel } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

// import { toast } from '~/components/ui/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

// type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const emailLoginFetcher = useFetcher();
  const googleLoginFetcher = useFetcher();
  // const {
  // 	register,
  // 	handleSubmit,
  // 	formState: { errors },
  // } = useForm<FormData>({
  // 	resolver: zodResolver(userAuthSchema),
  // });
  // // const [isLoading, setIsLoading] = useState<boolean>(false);
  // // const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  // async function onSubmit(data: FormData) {
  // 	setIsLoading(true);

  // 	const signInResult = await signIn('email', {
  // 		email: data.email.toLowerCase(),
  // 		redirect: false,
  // 		callbackUrl: searchParams?.get('from') || '/dashboard',
  // 	});

  // 	setIsLoading(false);

  // 	// TODO: replace shadcn toast by react-hot-toast
  // 	if (!signInResult?.ok) {
  // 		return toast({
  // 			title: 'Something went wrong.',
  // 			description: 'Your sign in request failed. Please try again.',
  // 			variant: 'destructive',
  // 		});
  // 	}

  // 	return toast({
  // 		title: 'Check your email',
  // 		description: 'We sent you a login link. Be sure to check your spam too.',
  // 	});
  // }
  const isLoading = emailLoginFetcher.state !== "idle";
  const isGoogleLoading = googleLoginFetcher.state !== "idle";

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <emailLoginFetcher.Form
        action="/login/email"
        method="post"
        autoComplete="off"
        className="w-full"
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <InputWithLabel
              label="Email"
              id="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              name="email"
              disabled={isLoading || isGoogleLoading}
              // error={errors.email}
              // {...register('email')}
            />
            {/* {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>} */}
          </div>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            {type === "register" ? "Sign Up with Email" : "Sign In with Email"}
          </Button>
        </div>
      </emailLoginFetcher.Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <googleLoginFetcher.Form
        action="/auth/google"
        method="post"
        className="grid"
      >
        <Button variant="outline" disabled={isLoading || isGoogleLoading}>
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-4" />
          )}{" "}
          Google
        </Button>
      </googleLoginFetcher.Form>
    </div>
  );
}
