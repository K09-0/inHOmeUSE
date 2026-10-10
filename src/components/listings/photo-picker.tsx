import { useRef, useState } from "react";
import { readPhotoFile } from "@/lib/photos";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 8;

export function PhotoPicker({
  lang,
  photos,
  onChange,
}: {
  lang: Lang;
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setError(null);
    const room = MAX_PHOTOS - photos.length;
    const next = [...photos];
    for (const file of Array.from(list).slice(0, room)) {
      try {
        next.push(await readPhotoFile(file));
      } catch {
        setError(t(lang, "photoError"));
      }
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{t(lang, "photos")}</p>
        <button
          type="button"
          className="text-sm text-primary"
          onClick={() => inputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
        >
          {t(lang, "addPhotos")}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="sr-only"
        onChange={(e) => void onFiles(e.target.files)}
      />
      {photos.length === 0 && <p className="mt-2 text-sm text-muted">{t(lang, "photosHint")}</p>}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((src, index) => (
          <div key={`${index}-${src.slice(-24)}`} className="relative">
            <img src={src} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-fg">
                {t(lang, "mainPhoto")}
              </span>
            )}
            <div className="mt-1 flex justify-between gap-1">
              {index > 0 ? (
                <button type="button" className="text-[11px] text-primary" onClick={() => onChange([src, ...photos.filter((_, i) => i !== index)])}>
                  {t(lang, "makeMain")}
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                className={cn("text-[11px] text-muted")}
                onClick={() => onChange(photos.filter((_, i) => i !== index))}
              >
                {t(lang, "removePhoto")}
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-primary">{error}</p>}
    </div>
  );
}
