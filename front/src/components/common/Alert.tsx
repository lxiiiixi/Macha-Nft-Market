function Alert({ content }: { content: string }) {
    return (
        <div
            role="alert"
            className={`daisy-alert absolute bottom-6 left-6 min-w-1/2 max-w-[80%] ${
                content.length !== 0 ? "alert-enter" : "alert-exit"
            }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <span>{content}</span>
        </div>
    );
}

export default Alert;
