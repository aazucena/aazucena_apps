import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { CustomReportForm } from "@aazucena/forms/templates";
const meta = {
  title: "Forms/Analytics/CustomReportForm",
  component: CustomReportForm,
  parameters: { layout: "centered", docs: { description: { component: "Bespoke report request: date range, metric selection, grouping, output format (CSV/PDF/JSON)." } } },
  tags: ["autodocs"],
  argTypes: { variant: { control: "select", options: ["default", "glass", "cyber"], table: { category: "Appearance" } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof CustomReportForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: "default" } };
export const Glass: Story = { args: { variant: "glass" } };
export const Cyber: Story = { args: { variant: "cyber" } };
