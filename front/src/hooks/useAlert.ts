import { useState, useEffect, ReactNode } from "react";

function useAlert(timeout = 4000): [ReactNode, React.Dispatch<React.SetStateAction<ReactNode>>] {
    const [alertContent, setAlertContent] = useState<ReactNode>();

    useEffect(() => {
        if (alertContent) {
            const timer = setTimeout(() => {
                setAlertContent("");
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [alertContent, timeout]);

    return [alertContent, setAlertContent];
}

export default useAlert;
