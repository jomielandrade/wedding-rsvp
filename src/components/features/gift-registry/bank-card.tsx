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
    <FadeUp delay={delay} className="w-full">
      <Card className="h-full p-5 sm:p-6">
        <CardHeader className="pb-3 text-center">
          <div
            className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg sm:text-xl">{bank.bankName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bank.qrImage && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm">
                <Image
                  src={bank.qrImage}
                  alt={`${bank.bankName} QR code`}
                  width={640}
                  height={800}
                  unoptimized
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 92vw, 448px"
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
