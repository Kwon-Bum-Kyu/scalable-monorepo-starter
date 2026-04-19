import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Disc,
  Eye,
  EyeOff,
  Github,
  Globe,
  Info,
  Linkedin,
  type LucideIcon,
  type LucideProps,
  Mail,
  MailOpen,
  Menu,
  Search,
  Square,
  SquareCheck,
  ToggleLeft,
  ToggleRight,
  Triangle,
  User,
  UserCircle2,
  X,
} from "lucide-react";
import * as React from "react";

export type SystemIconName =
  | "bars"
  | "search"
  | "info"
  | "close"
  | "circle"
  | "circle-filled"
  | "eye"
  | "eye-slash"
  | "chevron-right"
  | "chevron-left"
  | "chevron-up"
  | "chevron-down"
  | "toggle-on"
  | "toggle-off"
  | "user"
  | "user-circle"
  | "user-outline"
  | "envelope"
  | "envelope-outline"
  | "caret-up"
  | "caret-down"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "check-square"
  | "check-square-outline"
  | "check-circle"
  | "check-circle-outline"
  | "square"
  | "square-outline"
  | "linkedin"
  | "github"
  | "globe";

const iconMap: Record<SystemIconName, LucideIcon> = {
  bars: Menu,
  search: Search,
  info: Info,
  close: X,
  circle: Circle,
  "circle-filled": Disc,
  eye: Eye,
  "eye-slash": EyeOff,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "toggle-on": ToggleRight,
  "toggle-off": ToggleLeft,
  user: User,
  "user-circle": UserCircle2,
  "user-outline": User,
  envelope: Mail,
  "envelope-outline": MailOpen,
  "caret-up": Triangle,
  "caret-down": Triangle,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "check-square": SquareCheck,
  "check-square-outline": CheckSquare,
  "check-circle": CheckCircle2,
  "check-circle-outline": CheckCircle,
  square: Square,
  "square-outline": Square,
  linkedin: Linkedin,
  github: Github,
  globe: Globe,
};

export interface SystemIconProps extends Omit<LucideProps, "ref"> {
  name: SystemIconName;
}

const SystemIcon = React.forwardRef<SVGSVGElement, SystemIconProps>(
  ({ name, size = 16, ...props }, ref) => {
    const Icon = iconMap[name];
    if (!Icon) {
      return null;
    }
    return <Icon ref={ref} size={size} {...props} />;
  }
);
SystemIcon.displayName = "SystemIcon";

export { SystemIcon };
