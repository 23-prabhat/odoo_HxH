"use client";

import { useAppContext } from "@/context/app-context";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const { session } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Company information and currency settings." />
      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Name: {session.company.name}</p>
          <p>Country: {session.company.country}</p>
          <p>Currency: {session.company.currency}</p>
        </CardContent>
      </Card>
    </div>
  );
}
