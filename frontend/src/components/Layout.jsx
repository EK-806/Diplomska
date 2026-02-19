export default function Layout({ children }) {
    return (
        <div className={`relative bg-[url("/background.png")] overflow-hidden min-h-screen`}>
            <div className="absolute inset-0 bg-background dark:bg-dark-background bg-opacity-95 dark:bg-opacity-70 backdrop-blur-[2px]"></div>
            <div className="relative z-20">{children}</div>
        </div>
    );
}