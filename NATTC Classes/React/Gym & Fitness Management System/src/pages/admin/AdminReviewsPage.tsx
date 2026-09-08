import React from "react";
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

export default function AdminReviewsPage() {
  const reviews = useGymStore((s) => s.reviews);
  const toggleReviewApproval = useGymStore((s) => s.toggleReviewApproval);

  const toggleApproval = (id: string) => {
    toggleReviewApproval(id);
    notify.info({
      title: "LOCAL STATUS UPDATED",
      message: "Review publication status updated locally on this device.",
    });
  };

  const publishedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = reviews.length - publishedCount;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">FEEDBACK & MODERATION</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Member Review Moderation
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Approve, audit, or unpublish athlete testimonials displayed across public marketing showcases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              LOCAL MODERATION PREVIEW
            </Badge>
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {reviews.length} TESTIMONIALS ON FILE
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Moderation Telemetry Strip */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Total Submissions</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">{reviews.length}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Verified athlete reviews</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Published Public</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{publishedCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Visible on showcase</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Pending Audit</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">{pendingCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Requires staff clearance</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Consensus Rating</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">★ {avgRating} / 5.0</div>
            <p className="text-[10px] text-[#71717a] font-mono">Mean athlete rating</p>
          </div>
        </div>
      </SectionReveal>

      {/* Review Moderation Ledger */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#1f1f26] flex items-center justify-between bg-[#121217]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Athlete Feedback Ledger ({reviews.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#71717a]">
              Toggle publication to preview display (stored locally on this device)
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-[#71717a] mx-auto" aria-hidden="true" />
              <p className="text-sm font-bold text-white uppercase font-heading">No Reviews On File</p>
              <p className="text-xs text-[#a1a1aa] font-mono">No member testimonials have been submitted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1f1f26]">
              {reviews.map((rev) => {
                const isApproved = rev.isApproved;
                return (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[#121217] transition-colors"
                  >
                    <div className="space-y-2.5 max-w-2xl">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-white text-base font-heading">{rev.userName}</span>
                        <Badge variant="volt" className="font-mono text-[10px]">
                          ★ {rev.rating}.0 / 5.0
                        </Badge>
                        <Badge
                          variant={isApproved ? "success" : "default"}
                          className="text-[10px] font-mono uppercase border-[#1f1f26]"
                        >
                          {isApproved ? "PUBLISHED" : "PENDING AUDIT"}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-[#f4f4f5] italic leading-relaxed break-words">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#71717a] font-mono">
                        <span>Category: <span className="text-[#a1a1aa] uppercase">{rev.category}</span></span>
                        <span>•</span>
                        <span>Date: {rev.createdAt.split("T")[0]}</span>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto shrink-0">
                      <Button
                        variant={isApproved ? "ghost" : "volt"}
                        size="sm"
                        onClick={() => toggleApproval(rev.id)}
                        className="min-h-[40px] text-xs font-mono gap-1.5"
                      >
                        {isApproved ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                            Approve & Publish
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionReveal>
    </div>
  );
}
