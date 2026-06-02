import { Fragment, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import {
  DAYS,
  TIME_SLOTS,
  type TimetableSlot,
  loadTimetable,
  saveTimetable,
  ocrExtractedTimetable,
  slotColor,
} from "@/data/student-timetable";
import { toast } from "sonner";

function slotFitsHour(slot: TimetableSlot, hour: string): boolean {
  return slot.startTime <= hour && slot.endTime > hour;
}

export default function StudentTimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>(loadTimetable);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  const slotsByDay = useMemo(() => {
    const map: Record<string, TimetableSlot[]> = {};
    DAYS.forEach((d) => {
      map[d] = slots.filter((s) => s.day === d);
    });
    return map;
  }, [slots]);

  const applyOcr = () => {
    setOcrProcessing(true);
    setTimeout(() => {
      const merged = [...slots, ...ocrExtractedTimetable.filter(
        (o) => !slots.some((s) => s.id === o.id),
      )];
      setSlots(merged);
      saveTimetable(merged);
      setOcrProcessing(false);
      setOcrOpen(false);
      toast.success("Timetable extracted from image (mock OCR). Review and edit slots below.");
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Weekly schedule — upload an image for OCR extraction or add custom blocks"
      />

      <div className="ds-form-actions" style={{ marginBottom: 20 }}>
        <button type="button" className="btn btn-primary" onClick={() => setOcrOpen(true)}>
          Upload Timetable (OCR)
        </button>
        <button type="button" className="btn btn-success" onClick={() => setCustomOpen(true)}>
          Add Custom Block
        </button>
      </div>

      {ocrProcessing && (
        <p className="ds-text-secondary" style={{ marginBottom: 16 }}>
          Extracting schedule from image…
        </p>
      )}

      <DataCard label="Weekly View">
        <div className="ds-timetable-grid">
          <div className="ds-tt-head" />
          {DAYS.map((d) => (
            <div key={d} className="ds-tt-head">
              {d.slice(0, 3)}
            </div>
          ))}
          {TIME_SLOTS.map((hour) => (
            <Fragment key={hour}>
              <div className="ds-tt-time">
                {hour}
              </div>
              {DAYS.map((day) => {
                const cellSlots = slotsByDay[day].filter((s) => slotFitsHour(s, hour));
                return (
                  <div key={`${day}-${hour}`} className="ds-tt-cell">
                    {cellSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="ds-tt-slot"
                        style={{ background: slotColor(slot.type) }}
                        title="Click to remove"
                        onClick={() => {
                          if (!confirm(`Remove "${slot.title}"?`)) return;
                          const next = slots.filter((s) => s.id !== slot.id);
                          setSlots(next);
                          saveTimetable(next);
                        }}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="ds-tt-slot-title">{slot.title}</div>
                        <div className="ds-tt-slot-meta">
                          {slot.startTime}–{slot.endTime}
                          {slot.location ? ` · ${slot.location}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
        <p className="ds-text-secondary" style={{ marginTop: 12 }}>
          Click a block to remove it. Use Add Custom Block for study sessions or personal events.
        </p>
      </DataCard>

      <DocumentUploadDialog
        open={ocrOpen}
        onClose={() => setOcrOpen(false)}
        title="Upload Timetable Image"
        fields={[]}
        submitLabel={ocrProcessing ? "Processing…" : "Extract Schedule"}
        onSubmit={async () => {
          applyOcr();
        }}
      />

      <DocumentUploadDialog
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        title="Add Custom Time Block"
        fileRequired={false}
        showFileZone={false}
        submitLabel="Add to Timetable"
        fields={[
          {
            name: "day",
            label: "Day",
            type: "select",
            required: true,
            options: DAYS.map((d) => ({ value: d, label: d })),
          },
          { name: "startTime", label: "Start (HH:MM)", type: "text", required: true, placeholder: "14:00" },
          { name: "endTime", label: "End (HH:MM)", type: "text", required: true, placeholder: "16:00" },
          { name: "title", label: "Title", type: "text", required: true, placeholder: "Study — Algorithms" },
          { name: "location", label: "Location", type: "text", placeholder: "Library" },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            options: [
              { value: "study", label: "Study" },
              { value: "custom", label: "Custom" },
              { value: "class", label: "Class" },
            ],
          },
        ]}
        onSubmit={async (_file, values) => {
          const slot: TimetableSlot = {
            id: `custom-${Date.now()}`,
            day: values.day as TimetableSlot["day"],
            startTime: values.startTime,
            endTime: values.endTime,
            title: values.title,
            location: values.location,
            type: (values.type as TimetableSlot["type"]) || "custom",
          };
          const next = [...slots, slot];
          setSlots(next);
          saveTimetable(next);
          toast.success("Block added to timetable.");
        }}
      />
    </div>
  );
}
