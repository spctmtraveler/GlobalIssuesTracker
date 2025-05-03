import * as React from "react";
import { cn } from "@/lib/utils";

// Interface Title Component
export interface InterfaceTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

export const InterfaceTitle = React.forwardRef<HTMLDivElement, InterfaceTitleProps>(
  ({ className, accent = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-2xl font-bold tracking-tight relative z-10",
          accent ? "text-cyan-400" : "text-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);
InterfaceTitle.displayName = "InterfaceTitle";

// Interface Panel Component
export interface InterfacePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  focused?: boolean;
}

export const InterfacePanel = React.forwardRef<HTMLDivElement, InterfacePanelProps>(
  ({ className, focused = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-black/30 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300",
          focused
            ? "border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            : "border-cyan-900/50",
          className
        )}
        {...props}
      />
    );
  }
);
InterfacePanel.displayName = "InterfacePanel";

// Interface Stat Component
export interface InterfaceStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
}

export const InterfaceStat = React.forwardRef<HTMLDivElement, InterfaceStatProps>(
  ({ className, label, value, trend, size = "md", ...props }, ref) => {
    const trendColors = {
      up: "text-green-400",
      down: "text-red-400",
      neutral: "text-gray-400",
    };

    const trendIcons = {
      up: "↑",
      down: "↓",
      neutral: "○",
    };

    const sizes = {
      sm: {
        container: "p-2",
        label: "text-xs",
        value: "text-sm font-medium",
      },
      md: {
        container: "p-3",
        label: "text-sm",
        value: "text-base font-semibold",
      },
      lg: {
        container: "p-4",
        label: "text-base",
        value: "text-xl font-bold",
      },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-900/50 rounded border border-gray-800",
          sizes[size].container,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className={cn("text-gray-400", sizes[size].label)}>{label}</span>
          {trend && (
            <span className={cn("ml-2", trendColors[trend])}>
              {trendIcons[trend]}
            </span>
          )}
        </div>
        <div className={cn("text-cyan-400", sizes[size].value)}>{value}</div>
      </div>
    );
  }
);
InterfaceStat.displayName = "InterfaceStat";

// Interface Grid Component
export interface InterfaceGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export const InterfaceGrid = React.forwardRef<HTMLDivElement, InterfaceGridProps>(
  ({ className, cols = 2, gap = "md", ...props }, ref) => {
    const colsClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    const gapClasses = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    };

    return (
      <div
        ref={ref}
        className={cn("grid", colsClasses[cols], gapClasses[gap], className)}
        {...props}
      />
    );
  }
);
InterfaceGrid.displayName = "InterfaceGrid";

// Interface Badge Component
export interface InterfaceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  glowing?: boolean;
  color?: "blue" | "cyan" | "green" | "red" | "yellow" | "purple";
}

export const InterfaceBadge = React.forwardRef<HTMLDivElement, InterfaceBadgeProps>(
  ({ className, glowing = false, color = "cyan", ...props }, ref) => {
    const colorClasses = {
      blue: "bg-blue-900/30 border-blue-500 text-blue-400",
      cyan: "bg-cyan-900/30 border-cyan-500 text-cyan-400",
      green: "bg-green-900/30 border-green-500 text-green-400",
      red: "bg-red-900/30 border-red-500 text-red-400",
      yellow: "bg-yellow-900/30 border-yellow-500 text-yellow-400",
      purple: "bg-purple-900/30 border-purple-500 text-purple-400",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          colorClasses[color],
          glowing && `shadow-[0_0_8px_rgba(var(--${color}-500-rgb),0.5)]`,
          className
        )}
        {...props}
      />
    );
  }
);
InterfaceBadge.displayName = "InterfaceBadge";

// Interface Divider Component
export interface InterfaceDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  glowing?: boolean;
}

export const InterfaceDivider = React.forwardRef<HTMLHRElement, InterfaceDividerProps>(
  ({ className, glowing = false, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(
          "border-t border-cyan-900/50 my-4",
          glowing && "shadow-[0_0_5px_rgba(6,182,212,0.5)]",
          className
        )}
        {...props}
      />
    );
  }
);
InterfaceDivider.displayName = "InterfaceDivider";
