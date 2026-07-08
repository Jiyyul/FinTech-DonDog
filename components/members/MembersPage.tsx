"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Card from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";

const MEMBERS = [
  { name: "윤지영", role: "총무", initials: "지영" },
  { name: "김회장", role: "회장", initials: "회장" },
  { name: "박부총", role: "부총무", initials: "부총" },
  { name: "이기획", role: "기획부장", initials: "기획" },
];

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        대시보드
      </Link>

      <div className="mb-8">
        <p className="dash-section-label normal-case tracking-normal">구성원</p>
        <h1 className="ui-page-title mt-1">학생회 구성원</h1>
      </div>

      <ul className="space-y-3">
        {MEMBERS.map((member) => (
          <li key={member.name}>
            <Card className="flex items-center gap-4 !p-4">
              <Avatar initials={member.initials} />
              <div>
                <p className="font-semibold text-ink">{member.name}</p>
                <p className="text-[13px] text-muted">{member.role}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
