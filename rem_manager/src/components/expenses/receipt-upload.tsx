import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ReceiptUploadProps = {
  onFileNameChange: (fileName: string) => void;
};

export function ReceiptUpload({ onFileNameChange }: ReceiptUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="receipt">Receipt upload</Label>
      <Input
        id="receipt"
        type="file"
        onChange={(event) => onFileNameChange(event.target.files?.[0]?.name ?? "")}
      />
    </div>
  );
}
