"use client";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";

export default function BuddyActivity({
  buddies = [],
  currentUserId,
  onRespond,
  onEncourage,
  onError,
}) {
  const otherOf = (b) =>
    String(b.requester?._id) === String(currentUserId) ? b.addressee : b.requester;

  const respond = (id, status) => onRespond?.(id, status).catch(onError);
  const encourage = (id) => onEncourage?.(id).catch(onError);

  return (
    <div className="space-y-3">
      {buddies.map((b) => {
        const other = otherOf(b);
        const isAddressee =
          String(b.addressee?._id) === String(currentUserId);
        const pending = b.status === "pending";
        return (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-white">
                  {(other?.name || "?").charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{other?.name}</div>
                  <div className="text-xs opacity-70 capitalize">{b.status}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {isAddressee && pending && (
                  <>
                    <GlowButton onClick={() => respond(b._id, "accepted")}>Accept</GlowButton>
                    <GlowButton variant="ghost" onClick={() => respond(b._id, "declined")}>
                      Decline
                    </GlowButton>
                  </>
                )}
                {b.status === "accepted" && (
                  <GlowButton variant="ghost" onClick={() => encourage(b._id)}>
                    Encourage
                  </GlowButton>
                )}
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
      {buddies.length === 0 && <div className="opacity-60">No buddies yet.</div>}
    </div>
  );
}
