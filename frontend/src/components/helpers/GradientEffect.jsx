export default function MyGradientEffect() {
    return (
        <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-[70px] flex justify-start items-end">
            <div
                style={{
                    clipPath:
                        'polygon(0% 88.75%, 30.2% 61.95%, 22.31% 22.34%, 48.5% 7.75%, 11.82% 30.96%, 18% 0.75%, 30.2% 61.95%, 100% 0%, 100% 7.75%, 48.5% 55.26%, 74.25% 77.63%, 89.04% 71.87%, 67.05% 91.17%, 100% 100%, 74.25% 77.63%, 48.5% 55.26%, 0% 100%)',
                }}
                className="relative aspect-video w-full h-full bg-gradient-to-tr from-[#ef714c] to-[#1d4084] opacity-50 translate-y-11 "/>
        </div>
    );
}