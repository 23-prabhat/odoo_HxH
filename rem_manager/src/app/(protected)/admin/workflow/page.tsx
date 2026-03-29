"use client";

import { useAppContext } from "@/context/app-context";
import { WorkflowSettings } from "@/components/admin/workflow-settings";
import { PageHeader } from "@/components/layout/page-header";

export default function AdminWorkflowPage() {
  const { workflowSteps, managerApprover, updateManagerApprover } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader title="Workflow" description="Review the approval sequence and the manager-first policy." />
      <WorkflowSettings
        workflowSteps={workflowSteps}
        managerApprover={managerApprover}
        onManagerApproverChange={updateManagerApprover}
      />
    </div>
  );
}
