'use client';

const VIDEO_SRC = '/video/How%20its%20works.mp4';

export function VideoSection() {
  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 section-block">
      <div className="section-inner flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          See how it works
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
          Watch the flow from booking to recycling and traceability.
        </p>
        <div className="mt-8 w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-900 shadow-xl">
          <video
            className="w-full aspect-video"
            src={VIDEO_SRC}
            controls
            playsInline
            preload="metadata"
            aria-label="E-waste flow: how it works"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
