# DIRECTIONS TO CREATE THE PROJECT

## Project Setup & Configuration [DONE]

ACTION: Initialize project with:
- Bun as the bundler, dev server and test runner
- Vite.js + React/TypeScript template
- Biome for linting/formatting
- Tesseract.js, sharp as dependencies

## Key Quality Requirements

* Strict TypeScript: Full type coverage
* Abundant usage of JSDoc to allow code maintenance
* Error Boundaries: try catch and custom Errors
* Responsive Design: Desktop only application (no mobile required)

## Core Architecture Implementation

ACTION: Create these foundational modules:

1. `src/lib/video/`
   - Frame.ts (Implements Frame interface with color space conversions)
   - FrameBuffer.ts (FIFO buffer with frame comparison methods)

2. `src/lib/image-processing/`
   - filters.ts (Quantization, binarization, motion detection)
   - index.ts 

2. `src/lib/ocr/`
   - TesseractClient.ts (Wrapper for Tesseract.js with worker pool)
   - OCRQueue.ts (Job queue with parallel processing)

3. `src/lib/subtitles/`
   - SubtitleEntry.ts (class to hold the entry with the start and end timestamps)
   - SubtitlesQueue.ts (Push)
   - SubtitlesGenerator.ts (Process the queue + srt/vtt file generation)

4. `src/hooks/`
   - useEventBus.ts (Global EventBus for easy component communication: `subscribe()`, `on()`, `off()`)
   - useVideoProcessing.ts (Canvas frame processing pipeline: `addFrame()`)
   - useSubtitleDetection.ts (Monitor the crop region: `onSubtitleStart()`, `onSubtitleEnd()`)
   - useOCR.ts (`submitJob`, `startOCRProcess()`, `onJobDone()`)

## 8. Critical Tests to Include before building the UI

ACTION: Create the following unit test:

1. FrameBuffer unit tests
   - FIFO behavior
   - Background suppression (Motion detection)
2. Palette reduction
   - Reduce a palette with preservation of specific pinned colors
3. Subtitles Queue Processing
   - Add new entries
   - Avoid timestamps overlapping
   - Check and fix transcription errors (text correction)
4. SRT generation
   - Formatting correctness
   - Timecode conversion

## UI Elements

ACTION: Create the following components to build the final page:

1. `src/components/VideoSourceSelector.tsx` (File/URL input)
2. `src/components/LanguageSelector.tsx` (Select the language of the subtitles)
3. `src/components/PinnedColors.tsx` (Select the pinned colors of the subtitles with a color picker + display them)
4. `src/components/VideoCanvas.tsx` (Rendered canvas from a Video source element)
5. `src/components/CropOverlay.tsx` (Interactive rectangular region over the Canvas)
6. `src/components/ProcessingControls.tsx` (Play/pause/progress)
7. `src/components/SnapshotsList.tsx` (Scrollable list of the captured snapshots)
8. `src/components/OCRControls.tsx` (Launch/show progression of OCR jobs)
9. `src/components/OCRResults.tsx` (Subtitles preview + export)

CREATE the final index.html and the main `App.tsx` component.

10. `src/App.tsx` main components with sections and React providers for the EventBus and the useVideoProcessing() use hooks.

## 10. Deployment Configuration

ACTION: Add:
1. Vercel deployment config
2. Cloudflare Pages preset
3. Build script (vite.config.ts):

