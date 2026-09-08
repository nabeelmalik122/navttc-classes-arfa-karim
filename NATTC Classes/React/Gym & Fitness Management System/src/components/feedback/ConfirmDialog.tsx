import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, HelpCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  isLoading = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                isDestructive
                  ? "bg-red-950/80 border-red-800 text-red-400"
                  : "bg-[#08080a] border-[#1f1f26] text-[#dfff00]"
              }`}
            >
              {isDestructive ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <DialogTitle className="uppercase font-['Outfit'] text-base">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-xs text-zinc-400 leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "volt"}
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
