import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  X,
} from "lucide-react";
import {
  useNotificationStore,
  type NotificationItem,
  type NotificationType,
} from "@/store/useNotificationStore";

const ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertOctagon,
  loading: Loader2,
};

const TYPE_STYLES: Record<
  NotificationType,
  {
    border: string;
    iconColor: string;
    badgeBg: string;
    accentBar: string;
  }
> = {
  success: {
    border: "border-primary/30",
    iconColor: "text-primary",
    badgeBg: "bg-primary/10",
    accentBar: "bg-primary",
  },
  info: {
    border: "border-zinc-700/50",
    iconColor: "text-zinc-300",
    badgeBg: "bg-zinc-800/60",
    accentBar: "bg-zinc-500",
  },
  warning: {
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    accentBar: "bg-amber-500",
  },
  error: {
    border: "border-red-500/30",
    iconColor: "text-red-400",
    badgeBg: "bg-red-500/10",
    accentBar: "bg-red-500",
  },
  loading: {
    border: "border-primary/25",
    iconColor: "text-primary",
    badgeBg: "bg-primary/10",
    accentBar: "bg-primary",
  },
};

interface ToastItemProps {
  item: NotificationItem;
  onDismiss: (id: string) => void;
  isReducedMotion: boolean;
}

const ToastItem: React.FC<ToastItemProps> = React.memo(
  ({ item, onDismiss, isReducedMotion }) => {
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const remainingTimeRef = useRef<number>(item.duration ?? 0);

    const Icon = ICONS[item.type] || Info;
    const style = TYPE_STYLES[item.type] || TYPE_STYLES.info;

    const startTimer = useCallback(() => {
      if (item.duration === 0 || !item.duration || item.duration === Infinity) {
        return;
      }
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(item.id);
      }, remainingTimeRef.current);
    }, [item.duration, item.id, onDismiss]);

    const pauseTimer = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }, []);

    useEffect(() => {
      remainingTimeRef.current = item.duration ?? 0;
      if (!isPaused) {
        startTimer();
      }
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [item.duration, isPaused, startTimer]);

    const handleMouseEnter = () => {
      setIsPaused(true);
      pauseTimer();
    };

    const handleMouseLeave = () => {
      setIsPaused(false);
      startTimer();
    };

    const handleFocus = () => {
      setIsPaused(true);
      pauseTimer();
    };

    const handleBlur = () => {
      setIsPaused(false);
      startTimer();
    };

    const ariaRole = item.type === "error" ? "alert" : "status";
    const ariaLive = item.type === "error" ? "assertive" : "polite";

    const motionVariants = {
      initial: isReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, y: -12, scale: 0.98 },
      animate: isReducedMotion
        ? { opacity: 1 }
        : { opacity: 1, y: 0, scale: 1 },
      exit: isReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15 } },
    };

    return (
      <motion.div
        layout={!isReducedMotion}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role={ariaRole}
        aria-live={ariaLive}
        className={`pointer-events-auto relative w-full overflow-hidden rounded-md border bg-[#121217] p-3.5 shadow-2xl backdrop-blur-none transition-colors ${style.border}`}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-[3px] ${style.accentBar}`}
          aria-hidden="true"
        />

        <div className="flex items-start gap-3 pl-1">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#1F1F26] ${style.badgeBg} ${style.iconColor}`}
          >
            <Icon
              className={`h-4 w-4 ${item.type === "loading" ? "animate-spin" : ""}`}
            />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            {item.title && (
              <h4 className="font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                {item.title}
              </h4>
            )}
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-300 break-words font-sans">
              {item.message}
            </p>

            {item.action && (
              <div className="mt-2.5 flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    item.action?.onClick();
                    onDismiss(item.id);
                  }}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-[#2E2E38] bg-[#16161B] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-primary hover:bg-[#1f1f26] focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {item.action.label}
                </button>
              </div>
            )}
          </div>

          {item.dismissible && (
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              aria-label="Dismiss notification"
              className="group -mr-2 -mt-2 flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded p-2 text-zinc-500 transition-colors hover:bg-[#1F1F26] hover:text-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <X className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }
);

ToastItem.displayName = "ToastItem";

export function IronyxToaster() {
  const notifications = useNotificationStore((state) => state.notifications);
  const dismissNotification = useNotificationStore(
    (state) => state.dismissNotification
  );

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed z-[99999] flex flex-col gap-2.5 transition-all
        top-4 inset-x-4 max-w-[calc(100vw-32px)] mx-auto
        sm:top-6 sm:right-6 sm:left-auto sm:inset-x-auto sm:w-full sm:max-w-[380px]"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((item) => (
          <ToastItem
            key={item.id}
            item={item}
            onDismiss={dismissNotification}
            isReducedMotion={isReducedMotion}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default IronyxToaster;
