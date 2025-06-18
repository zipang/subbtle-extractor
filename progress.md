# DIRECTIONS TO CREATE THE PROJECT

## Project Setup & Configuration

- [x] Initialize project with:
  - [x] Bun as the bundler, dev server and test runner
  - [x] Vite.js + React/TypeScript template
  - [x] Biome for linting/formatting
  - [x] Tesseract.js, sharp as dependencies

## Code Quality Requirements

- [x] Strict TypeScript: Full type coverage
- [x] Describe all public methods with JSDoc
- [ ] Test edge cases early and throw meaningfull Exception. Don't ignore them.
- [x] Error Boundaries: try catch() and custom Errors
- [ ] Minimal Responsive Design: Desktop only application (no mobile required)

## Core Architecture Implementation

- [ ] Internal core APIs and utils

  - [x] `src/lib/video/`
    - [x] Frame.ts (Implements Frame interface with color space conversions)
    - [x] FrameBuffer.ts (FIFO buffer with frame comparison methods)

  - [ ] `src/lib/image-processing/`
    - [ ] filters.ts (Quantization, binarization, motion detection)
    - [ ] index.ts 

  - [ ] `src/lib/ocr/`
    - [ ] TesseractClient.ts (Wrapper for Tesseract.js with worker pool)
    - [ ] OCRQueue.ts (Job queue with parallel processing)

  - [x] `src/lib/subtitles/`
    - [x] SubtitleEntry.ts (class to hold the entry with the start and end timestamps)
    - [x] SubtitlesQueue.ts (`push()` new entries + `generate()` : process the queue to generate a `srt` or `vtt` subtitle file as text)

  - [ ] `src/hooks/`
    - [ ] useEventBus.ts (Global EventBus for easy component communication: `subscribe()`, `on()`, `off()`)
    - [ ] useVideoProcessing.ts (Canvas frame processing pipeline: `addFrame()`)
    - [ ] useSubtitleDetection.ts (Monitor the crop region: `onSubtitleStart()`, `onSubtitleEnd()`)
    - [ ] useOCR.ts (`submitJob`, `startOCRProcess()`, `onJobDone()`)

## 8. Critical Tests to Include before building the UI

- [ ] Create the following unit test:

  - [X] FrameBuffer unit tests
    - [X] FIFO behavior
    - [ ] Background suppression filter (using Motion detection)
  - [ ] Palette reduction
    - [ ] Reduce a palette with preservation of specific pinned colors
  - [x] Subtitles Queue Processing
    - [x] Add new entries
    - [x] Avoid timestamps overlapping
    - [ ] Check and fix transcription errors (text correction)
  - [x] SRT generation
    - [x] Formatting correctness
    - [x] Timecode conversion

## UI Elements

- [ ] Create the following components to build the final page:

  - [ ] `src/components/VideoSourceSelector.tsx` (File/URL input)
  - [ ] `src/components/LanguageSelector.tsx` (Select the language of the subtitles)
  - [ ] `src/components/PinnedColors.tsx` (Select the pinned colors of the subtitles with a color picker + display them)
  - [ ] `src/components/VideoCanvas.tsx` (Rendered canvas from a Video source element)
  - [ ] `src/components/CropOverlay.tsx` (Interactive rectangular region over the Canvas)
  - [ ] `src/components/ProcessingControls.tsx` (Play/pause/progress)
  - [ ] `src/components/SnapshotsList.tsx` (Scrollable list of the captured snapshots)
  - [ ] `src/components/OCRControls.tsx` (Launch/show progression of OCR jobs)
  - [ ] `src/components/OCRResults.tsx` (Subtitles preview + export)

- [ ] CREATE the final index.html and the main `App.tsx` component.

  - [ ] `src/App.tsx` main components with sections and React providers for the EventBus and the useVideoProcessing() use hooks.

## 10. Deployment Configuration

- [ ] Add:
  - [ ] Vercel deployment config
  - [ ] Cloudflare Pages preset
  - [ ] Build script (vite.config.ts)
