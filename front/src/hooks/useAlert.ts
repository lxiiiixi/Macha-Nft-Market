import { useState, useEffect } from "react";

function useAlert(timeout = 3000): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [alertContent, setAlertContent] = useState("");

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
