import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, LayoutList } from "lucide-react";
import { SECTIONS } from "@/lib/studio";

const LABELS = SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: s.label }), {});

export default function PreferencesPanel({ order, visible, onToggle, onReorder }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const next = Array.from(order);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onReorder(next);
  };

  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#B8C5E8]">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
          <LayoutList className="h-3 w-3" />
        </span>
        Preferences
      </div>
      <p className="mb-2.5 text-[11px] leading-relaxed text-[#9FAEDB]">
        Centang bagian yang ingin ditampilkan, tarik ikon di kiri untuk mengatur urutan.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="preferences-sections">
          {(dropProvided) => (
            <ul ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-1.5">
              {order.map((id, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-2 rounded-lg px-1.5 py-1.5 ${
                        snapshot.isDragging ? "bg-white/15" : "bg-white/5"
                      }`}
                    >
                      <span {...provided.dragHandleProps} className="cursor-grab text-[#8C9AC9] active:cursor-grabbing">
                        <GripVertical className="h-3.5 w-3.5" />
                      </span>
                      <label className="flex flex-1 cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#E7EBFF]">
                        <input
                          type="checkbox"
                          checked={!!visible[id]}
                          onChange={() => onToggle(id)}
                          className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]"
                        />
                        {LABELS[id]}
                      </label>
                    </li>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}