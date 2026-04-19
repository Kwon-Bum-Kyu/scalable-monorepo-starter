import React from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaBars,
  FaCaretDown,
  FaCaretUp,
  FaCheckCircle,
  FaCheckSquare,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaGlobe,
  FaInfoCircle,
  FaLinkedin,
  FaRegCheckCircle,
  FaRegCheckSquare,
  FaRegCircle,
  FaRegEnvelope,
  FaRegSquare,
  FaRegUser,
  FaSearch,
  FaSquare,
  FaTimes,
  FaToggleOff,
  FaToggleOn,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";

import { SystemIconName, SystemIconProps } from "./types";

const iconMap: Record<
  SystemIconName,
  React.FC<{ className?: string; size?: number | string }>
> = {
  bars: FaBars,
  search: FaSearch,
  info: FaInfoCircle,
  close: FaTimes,
  circle: FaRegCircle,
  "circle-filled": FaCircle,
  eye: FaEye,
  "eye-slash": FaEyeSlash,
  "chevron-right": FaChevronRight,
  "chevron-left": FaChevronLeft,
  "chevron-up": FaChevronUp,
  "chevron-down": FaChevronDown,
  "toggle-on": FaToggleOn,
  "toggle-off": FaToggleOff,
  user: FaUser,
  "user-circle": FaUserCircle,
  "user-outline": FaRegUser,
  envelope: FaEnvelope,
  "envelope-outline": FaRegEnvelope,
  "caret-up": FaCaretUp,
  "caret-down": FaCaretDown,
  "arrow-up": FaArrowUp,
  "arrow-down": FaArrowDown,
  "arrow-left": FaArrowLeft,
  "arrow-right": FaArrowRight,
  "check-square": FaCheckSquare,
  "check-square-outline": FaRegCheckSquare,
  "check-circle": FaCheckCircle,
  "check-circle-outline": FaRegCheckCircle,
  square: FaSquare,
  "square-outline": FaRegSquare,
  linkedin: FaLinkedin,
  github: FaGithub,
  globe: FaGlobe,
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
