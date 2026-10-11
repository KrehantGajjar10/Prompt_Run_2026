import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface ConfirmResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Reset to Demo Data',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-zinc-300">{description}</p>
        </div>

        <div className="pt-2 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto justify-center"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
