"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { FadeUp } from "@/components/animations/motion-primitives";
import { CopyField } from "@/components/features/gift-registry/copy-field";
import { QrDownloadButton } from "@/components/features/gift-registry/qr-download-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BankAccount } from "@/types/wedding";

interface BankCardProps {
  bank: BankAccount;
  delay?: number;
}

export function BankCard({ bank, delay = 0 }: BankCardProps) {
  return (
    <FadeUp delay={delay} className="w-full max-w-sm">
      <Card className="h-full">
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{bank.bankName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {bank.qrImage && (
            <div className="space-y-3">
              <div className="mx-auto w-fit overflow-hidden rounded-xl border border-primary/10 bg-white p-3">
                <Image
                  src={bank.qrImage}
                  alt={`${bank.bankName} QR code`}
                  width={200}
                  height={200}
                  unoptimized
                  className="h-48 w-48 object-contain"
                />
              </div>
              <QrDownloadButton src={bank.qrImage} bankName={bank.bankName} />
            </div>
          )}

          <CopyField label="Account Name" value={bank.accountName} />
          <CopyField label="Account Number" value={bank.accountNumber} />
        </CardContent>
      </Card>
    </FadeUp>
  );
}
