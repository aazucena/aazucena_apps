import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  Input,
  Label,
  Checkbox,
  Separator,
} from '@aazucena/ui';

/**
 * ## Auth Card Recipe
 * Demonstrates sign-in and sign-up patterns using Card, Input, Checkbox, and Button primitives.
 */
const meta = {
  title: 'Recipes/Cards/AuthCard',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Authentication card patterns (Sign In / Sign Up) composed from Card, Input, Checkbox, and Button primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Sign in form with email, password, and remember-me checkbox.
 */
export const SignIn: Story = {
  render: () => (
    <Card className="w-[400px] shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black tracking-tighter">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" className="h-11" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input id="password" type="password" placeholder="••••••••" className="h-11" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Remember me for 30 days
          </Label>
        </div>
        <Button className="w-full h-11" size="default">
          Sign In
        </Button>
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>
        <Button variant="outline" className="w-full h-11">
          Continue with GitHub
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:underline font-medium">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'securepassword');
    await expect(emailInput).toHaveValue('user@example.com');
    await expect(passwordInput).toHaveValue('securepassword');
  },
};

/**
 * Sign up form with name, email, password, and terms acceptance.
 */
export const SignUp: Story = {
  render: () => (
    <Card className="w-[400px] shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black tracking-tighter">Create Account</CardTitle>
        <CardDescription>Join thousands of developers building with this stack.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first">First Name</Label>
            <Input id="first" placeholder="Aldrin" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last Name</Label>
            <Input id="last" placeholder="Azucena" className="h-11" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="name@example.com" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            className="h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              terms of service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              privacy policy
            </a>
            .
          </Label>
        </div>
        <Button className="w-full h-11">Create Account</Button>
      </CardContent>
    </Card>
  ),
};
