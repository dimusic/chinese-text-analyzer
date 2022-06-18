import { DragEvent, ReactNode, useRef, useState } from "react";
import './drag-and-drop.css';

interface DragAndDropProps {
    processDrop: (text: string) => void,
    children?: ReactNode | ReactNode[],
}

function DragAndDrop(
    { processDrop, children }: DragAndDropProps
) {
    let [dragOverlay, setDragOverlay] = useState(false);
    const [data, setData] = useState('');
    const [error, setError] = useState(false);
    let dragCounter = useRef(0);

    const fileReader = (files: FileList) => {
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = (loadEvt)=> {
            const text = reader.result as string;
            setData(text);
            processDrop(text);
        };
    };

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current++;
        if (e.dataTransfer?.items?.length > 0) {
            setDragOverlay(true);
        }
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragOverlay(false);
        }
    };

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer?.files;
        setDragOverlay(false);
        setError(false);
        dragCounter.current = 0;
        // const { isValidFile, errVal } = fileValidator(files, config);
        // if (!isValidFile) {
        //   if (errVal) {
        //     setError(errVal);
        //   }
        //   return false;
        // }
        fileReader(files);
        // processDrop(files);
    };

    const dragOverlayClass = dragOverlay ? "overlay" : "";
    return (
        <div>
            {error && <p className="error">{error}</p>}
            <div
                className={`drag-container ${dragOverlayClass}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {children}
                <div className="button-wrapper">
                    {data && <button onClick={() => setData('')}>Remove</button>}
                </div>
            </div>
        </div>
    );
}

export default DragAndDrop;
