import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { ApiAccessForm } from "@aazucena/forms/templates";
const meta = {
  title: "Forms/Analytics/ApiAccessForm",
  component: ApiAccessForm,
  parameters: { layout: "centered", docs: { description: { component: "Two-step API key request: identity then use case justification + terms agreement." } } },
  tags: ["autodocs"],
  argTypes: { variant: { control: "select", options: ["default", "glass", "cyber"], table: { category: "Appearance" } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof ApiAccessForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: "default" } };
export const Glass: Story = { args: { variant: "glass" } };
export const Cyber: Story = { args: { variant: "cyber" } };
