import { Fragment, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import {
  DAYS,
  TIME_SLOTS,
  TIMETABLE_COLOR_PRESETS,
  type TimetableSlot,
  loadTimetable,
  saveTimetable,
  ocrExtractedTimetable,
  slotColor,
  isValidTimeBlock,
  hasImportedTimetable,
  markTimetableImported,
} from "@/data/student-timetable";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { validateDocument } from "@/lib/document-scanner";

function slotFitsHour(slot: TimetableSlot, hour: string): boolean {
  return slot.startTime <= hour && slot.endTime > hour;
}

export default function StudentSchedulePage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimetableSlot[]>(loadTimetable);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [previewSlots, setPreviewSlots] = useState<TimetableSlot[] | null>(null);
  const [hasImported, setHasImported] = useState(hasImportedTimetable);
  const [selectedColor, setSelectedColor] = useState(TIMETABLE_COLOR_PRESETS[0].hex);

  const slotsByDay = useMemo(() => {
    const map: Record<string, TimetableSlot[]> = {};
    DAYS.forEach((d) => {
      map[d] = slots.filter((s) => s.day === d);
    });
    return map;
  }, [slots]);

  const sortedPreviewSlots = useMemo(() => {
    if (!previewSlots) return [];
    return [...previewSlots].sort((a, b) => {
      const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [previewSlots]);

  const applyOcr = async (file: File | null): Promise<void> => {
    if (!file) {
      toast.error("Please select a document to upload.");
      throw new Error("No file selected");
    }

    // Run AI Scanner Validation
    const validation = await validateDocument(file, "timetable");
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setOcrProcessing(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setOcrProcessing(false);
        setPreviewSlots([...ocrExtractedTimetable]);
        toast.info("AI Scanner: Document processed. Review extracted classes before saving.");
        resolve();
      }, 1500);
    });
  };

  const finishImport = () => {
    markTimetableImported();
    setHasImported(true);
  };

  const cancelPreview = () => {
    setPreviewSlots(null);
  };

  const confirmMerge = () => {
    if (!previewSlots) return;
    const merged = [
      ...slots,
      ...previewSlots.filter((o) => !slots.some((s) => s.id === o.id)),
    ];
    setSlots(merged);
    saveTimetable(merged);
    setPreviewSlots(null);
    finishImport();
    toast.success("Timetable merged successfully.");
  };

  const confirmReplace = () => {
    if (!previewSlots) return;
    setSlots(previewSlots);
    saveTimetable(previewSlots);
    setPreviewSlots(null);
    finishImport();
    toast.success("Timetable replaced successfully.");
  };

  if (!user) return null;

  return (
    <div className="ds-page-scroll ds-schedule-page">
      <div className="ds-tab-bar ds-schedule-tab-bar">
        <button type="button" className="ds-tab-btn" onClick={() => setBlockOpen(true)}>
          Add Time Block
        </button>
      </div>

      {ocrProcessing && (
        <p className="ds-text-secondary" style={{ marginBottom: 12 }}>
          Extracting schedule from image…
        </p>
      )}
      <DataCard
        label="Weekly Timetable"
        headerAction={
          <button
            type="button"
            className={`ds-tab-btn${hasImported ? " ds-tab-btn-muted" : ""}`}
            onClick={() => setOcrOpen(true)}
          >
            {hasImported ? "Update schedule" : "Import timetable"}
          </button>
        }
      >
        <div className="ds-timetable-scroll">
          <div className="ds-timetable-grid ds-timetable-compact">
            <div className="ds-tt-head" />
            {DAYS.map((d) => (
              <div key={d} className="ds-tt-head">
                {d.slice(0, 3)}
              </div>
            ))}
            {TIME_SLOTS.map((hour) => (
              <Fragment key={hour}>
                <div className="ds-tt-time">{hour}</div>
                {DAYS.map((day) => {
                  const cellSlots = slotsByDay[day].filter((s) => slotFitsHour(s, hour));
                  return (
                    <div key={`${day}-${hour}`} className="ds-tt-cell">
                      {cellSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="ds-tt-slot"
                          style={{ background: slotColor(slot) }}
                          role="button"
                          tabIndex={0}
                          title="Click to remove"
                          onClick={() => {
                            if (!confirm(`Remove "${slot.title}"?`)) return;
                            const next = slots.filter((s) => s.id !== slot.id);
                            setSlots(next);
                            saveTimetable(next);
                          }}
                          onKeyDown={() => {}}
                        >
                          <div className="ds-tt-slot-title">{slot.title}</div>
                          <div className="ds-tt-slot-meta">
                            {slot.startTime}–{slot.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
        {hasImported && (
          <p className="ds-text-secondary" style={{ marginTop: 12, fontSize: 13 }}>
            Click a block to remove it, or use <strong>Add Time Block</strong> for personal sessions.
          </p>
        )}
      </DataCard>

      <DocumentUploadDialog
        open={ocrOpen}
        onClose={() => setOcrOpen(false)}
        title={hasImported ? "Update timetable" : "Import timetable"}
        fields={[]}
        submitLabel="Extract with OCR"
        suppressSuccessToast
        onSubmit={async (file) => applyOcr(file)}
      />

      <Dialog open={previewSlots !== null} onOpenChange={(open) => !open && cancelPreview()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review extracted timetable</DialogTitle>
            <DialogDescription>
              {sortedPreviewSlots.length} class
              {sortedPreviewSlots.length === 1 ? "" : "es"} found. Merge with your current schedule
              or replace it entirely.
            </DialogDescription>
          </DialogHeader>
          <div className="ds-table-wrap" style={{ maxHeight: 280, overflowY: "auto" }}>
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Course</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sortedPreviewSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.day.slice(0, 3)}</td>
                    <td>
                      {slot.startTime}–{slot.endTime}
                    </td>
                    <td>{slot.title}</td>
                    <td>{slot.location ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 flex-wrap">
            <Button type="button" variant="outline" onClick={cancelPreview}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" onClick={confirmMerge}>
              Merge with current
            </Button>
            <Button type="button" onClick={confirmReplace}>
              Replace all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DocumentUploadDialog
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Add Time Block"
        fileRequired={false}
        showFileZone={false}
        submitLabel="Add to Timetable"
        extraContent={
          <div className="ds-form-group">
            <label className="ds-form-label">Block color</label>
            <div className="ds-color-picker">
              {TIMETABLE_COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`ds-color-swatch${selectedColor === c.hex ? " selected" : ""}`}
                  style={{ background: c.hex }}
                  title={c.label}
                  onClick={() => setSelectedColor(c.hex)}
                />
              ))}
            </div>
          </div>
        }
        fields={[
          {
            name: "day",
            label: "Day",
            type: "select",
            required: true,
            options: DAYS.map((d) => ({ value: d, label: d })),
          },
          { name: "startTime", label: "Start", type: "text", required: true, placeholder: "08:00" },
          {
            name: "endTime",
            label: "End (max midnight)",
            type: "text",
            required: true,
            placeholder: "10:00",
          },
          { name: "title", label: "Title", type: "text", required: true, placeholder: "Study session" },
          { name: "location", label: "Location", type: "text" },
        ]}
        onSubmit={async (_file, values) => {
          if (!isValidTimeBlock(values.startTime, values.endTime)) {
            toast.error("Times must be between 08:00 and midnight (24:00), with end after start.");
            throw new Error("Invalid time range");
          }
          const slot: TimetableSlot = {
            id: `custom-${Date.now()}`,
            day: values.day as TimetableSlot["day"],
            startTime: values.startTime,
            endTime: values.endTime,
            title: values.title,
            location: values.location,
            type: "custom",
            color: selectedColor,
          };
          const next = [...slots, slot];
          setSlots(next);
          saveTimetable(next);
          toast.success("Block added.");
        }}
      />
    </div>
  );
}
