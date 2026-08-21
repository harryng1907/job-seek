"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { moveBy, moveTo } from "@/lib/resume";

/**
 * Reordering for CV blocks.
 *
 * Pointer drag and keyboard-friendly up/down buttons both go through the same
 * `onReorder(nextIds)` callback, so a configuration only ever stores an array of
 * ids — no drag library, no positional state to keep in sync.
 */

export interface ReorderControls {
  handleProps: {
    onPointerDown: () => void;
    onPointerUp: () => void;
    title: string;
  };
  moveUp: () => void;
  moveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
}

export function DragList<T>({
  items,
  getId,
  onReorder,
  className = "space-y-2",
  children,
}: {
  items: T[];
  getId: (item: T) => string;
  onReorder: (ids: string[]) => void;
  className?: string;
  children: (item: T, controls: ReorderControls) => ReactNode;
}) {
  const ids = items.map(getId);
  const [armedId, setArmedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const clear = () => {
    setArmedId(null);
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className={className}>
      {items.map((item, index) => {
        const id = getId(item);
        const isDragging = dragId === id;
        const isTarget = overId === id && dragId !== null && dragId !== id;

        const controls: ReorderControls = {
          // Only the handle arms the drag, so text inside inputs stays selectable.
          handleProps: {
            onPointerDown: () => setArmedId(id),
            onPointerUp: () => setArmedId(null),
            title: "Drag to reorder",
          },
          moveUp: () => onReorder(moveBy(ids, id, -1)),
          moveDown: () => onReorder(moveBy(ids, id, 1)),
          isFirst: index === 0,
          isLast: index === items.length - 1,
          isDragging,
        };

        return (
          <div
            key={id}
            draggable={armedId === id}
            onDragStart={(event) => {
              setDragId(id);
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={clear}
            onDragOver={(event) => {
              if (!dragId || dragId === id) return;
              event.preventDefault();
              setOverId(id);
            }}
            onDragLeave={() => setOverId((current) => (current === id ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              if (dragId && dragId !== id) onReorder(moveTo(ids, dragId, id));
              clear();
            }}
            className={`transition-opacity ${isDragging ? "opacity-40" : ""} ${
              isTarget ? "ring-accent/50 rounded-xl ring-2" : ""
            }`}
          >
            {children(item, controls)}
          </div>
        );
      })}
    </div>
  );
}

/** Grip + up/down buttons, shared by every reorderable block. */
export function ReorderHandle({ controls }: { controls: ReorderControls }) {
  return (
    <div className="flex items-center gap-0.5">
      <span
        {...controls.handleProps}
        className="text-faint hover:text-muted cursor-grab touch-none active:cursor-grabbing"
        aria-hidden
      >
        <GripVertical className="h-4 w-4" />
      </span>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={controls.moveUp}
          disabled={controls.isFirst}
          aria-label="Move up"
          className="text-faint hover:text-ink disabled:hover:text-faint transition-colors disabled:opacity-30"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={controls.moveDown}
          disabled={controls.isLast}
          aria-label="Move down"
          className="text-faint hover:text-ink disabled:hover:text-faint transition-colors disabled:opacity-30"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
