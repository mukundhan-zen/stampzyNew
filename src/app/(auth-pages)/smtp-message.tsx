import { MailCheck } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4 items-center">
      <MailCheck size={20} />
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">Check your email</h3>
        <p className="text-sm text-secondary-foreground">
          We've sent a verification link to your email address.
        </p>
      </div>
    </div>
  );
}
