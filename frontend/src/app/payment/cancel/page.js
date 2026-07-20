import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#1a1613] px-4">
      <div className="max-w-md rounded-lg border border-[#2a251f] bg-[#211c17] p-8 text-center">
        <h1 className="font-display text-2xl text-[#c96a5a]">تم إلغاء عملية الدفع</h1>
        <p className="mt-4 font-body text-sm text-[#a9a196]">سلتك لسا موجودة، جرب مرة تانية.</p>
        <Link href="/cart" className="mt-6 inline-block rounded-md bg-[#c69749] px-6 py-2 font-body text-sm text-[#1a1613]">
          الرجوع للسلة
        </Link>
      </div>
    </main>
  );
}