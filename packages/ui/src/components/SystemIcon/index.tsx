import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Eye,
  EyeOff,
  Github,
  Globe,
  Info,
  Linkedin,
  type LucideIcon,
  Mail,
  Menu,
  Search,
  Square,
  ToggleLeft,
  ToggleRight,
  User,
  UserCircle,
  X,
} from "lucide-react";
import React from "react";

import { SystemIconName, SystemIconProps } from "./types";

type IconComponent = React.FC<{
  className?: string;
  size?: number | string;
}>;

const withFill = (Icon: LucideIcon): IconComponent => {
  const Filled: IconComponent = ({ className, size }) => (
    <Icon className={className} size={size} fill="currentColor" />
  );
  Filled.displayName = `Filled(${Icon.displayName ?? "Icon"})`;
  return Filled;
};

const iconMap: Record<SystemIconName, IconComponent> = {
  bars: Menu,
  search: Search,
  info: Info,
  close: X,
  circle: Circle,
  "circle-filled": withFill(Circle),
  eye: Eye,
  "eye-slash": EyeOff,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "toggle-on": ToggleRight,
  "toggle-off": ToggleLeft,
  user: User,
  "user-circle": UserCircle,
  "user-outline": User,
  envelope: Mail,
  "envelope-outline": Mail,
  "caret-up": ChevronUp,
  "caret-down": ChevronDown,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "check-square": withFill(CheckSquare),
  "check-square-outline": CheckSquare,
  "check-circle": withFill(CheckCircle2),
  "check-circle-outline": CheckCircle2,
  square: withFill(Square),
  "square-outline": Square,
  linkedin: Linkedin,
  github: Github,
  globe: Globe,
};

const SystemIcon: React.FC<SystemIconProps> = ({
  name,
  size = 16,
  className = "",
}) => {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
};

export default SystemIcon;
