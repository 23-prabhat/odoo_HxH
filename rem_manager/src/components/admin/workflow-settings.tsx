"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkflowSettingsProps = {
  workflowSteps: string[];
  managerApprover: boolean;
  onManagerApproverChange: (value: boolean) => void;
};

export function WorkflowSettings({
  workflowSteps,
  managerApprover,
  onManagerApproverChange,
}: WorkflowSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval sequence</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Ordered review steps for a standard expense request.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <div key={step} className="flex items-center justify-between rounded-2xl border border-border/80 px-4 py-4">
              <div>
                <p className="text-sm font-medium">Step {index + 1}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step}</p>
              </div>
              <div className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Active
              </div>
            </div>
          ))}
        </div>
        <label className="flex items-center justify-between rounded-2xl border border-border/80 px-4 py-4">
          <div>
            <p className="text-sm font-medium">Is Manager Approver</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Insert the employee&apos;s manager as the first approval step.
            </p>
          </div>
          <input
            type="checkbox"
            checked={managerApprover}
            onChange={(event) => onManagerApproverChange(event.target.checked)}
            className="size-4 rounded border-input"
          />
        </label>
      </CardContent>
    </Card>
  );
}
