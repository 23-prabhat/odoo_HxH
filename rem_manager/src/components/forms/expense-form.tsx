"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { categories, currencies } from "@/lib/mock-data";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReceiptUpload } from "@/components/expenses/receipt-upload";

export function ExpenseForm() {
  const router = useRouter();
  const { createExpense } = useAppContext();
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    category: "Travel",
    description: "",
    date: "",
    receiptName: "",
  });

  return (
    <Card>
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle>New expense</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the original amount and attach the receipt for review.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createExpense({
              amount: Number(form.amount),
              currency: form.currency,
              category: form.category,
              description: form.description,
              date: form.date,
              receiptName: form.receiptName,
            });
            router.push("/expenses/history");
            router.refresh();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                value={form.currency}
                onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </div>
          <ReceiptUpload
            onFileNameChange={(fileName) =>
              setForm((current) => ({
                ...current,
                receiptName: fileName,
              }))
            }
          />
          <div className="rounded-2xl bg-muted/50 px-4 py-4 text-sm text-muted-foreground">
            Submitted amounts stay in the original currency and are later shown in company currency for approvals.
          </div>
          <Button type="submit">Submit expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}
