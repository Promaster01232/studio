"use client";

import { ReactNode } from "react";

/**
 * AIUsageGuard - Institutional Protocol: 
 * All usage limits have been removed as per Root Authority request.
 * Citizens have unrestricted access to all forensic AI terminals.
 */
interface AIUsageGuardProps {
  children: ReactNode;
  featureName: string;
}

export function AIUsageGuard({ children }: AIUsageGuardProps) {
  // Absolute Permission: Return children directly to skip all usage audit checks.
  return <>{children}</>;
}
