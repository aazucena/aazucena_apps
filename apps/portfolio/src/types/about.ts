import type { IconComponent } from "./icons";

export interface MasteryItem {
  name: string;
  exp: string;
  description: string;
  color: string;
}

export interface RootItem {
  title: string;
  desc: string;
  icon: IconComponent;
}

export interface InterestItem {
  title: string;
  desc: string;
  icon: IconComponent;
  color: string;
}

export interface WorkflowTool {
  name: string;
  detail: string;
}

export interface Language {
  name: string;
  level: string;
}
