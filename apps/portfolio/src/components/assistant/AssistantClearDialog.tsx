"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@aazucena/ui";

interface AssistantClearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  /** Runs when the dialog has closed, in place of Radix returning focus to the opener. */
  onCloseFocus: () => void;
}

export function AssistantClearDialog({
  open,
  onOpenChange,
  onConfirm,
  onCloseFocus,
}: AssistantClearDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className="z-[200]"
        overlayClassName="z-[200]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onCloseFocus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your chat history with Rin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
