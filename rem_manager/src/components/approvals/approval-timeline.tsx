type ApprovalTimelineProps = {
  steps: string[];
};

export function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={`${step}-${index}`} className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
            {index + 1}
          </span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
