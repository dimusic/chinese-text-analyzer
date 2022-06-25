import { CSSProperties, DragEvent, ReactNode, useCallback, useRef, useState } from "react";
import FileDropOverlay from "../../pages/text-analyzer/components/file-drop-overlay";

interface FileDragAndDropContainerProps {
    onDrop: (file: File) => void;
    validateFn: (file: File) => Promise<boolean>;
    style: CSSProperties,
    children: ReactNode | ReactNode[];
}

function FileDragAndDropContainer(
    {
        onDrop,
        validateFn,
        style,
        children
    }: FileDragAndDropContainerProps
) {
    const [showFileDropOverlay, setShowFileDropOverlay] = useState<boolean>(false);
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    let dragCounter = useRef(0);

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current++;

        const items = e.dataTransfer.items;
        if (items.length === 0) {
            return;
        }

        if (items.length === 0) {
            return;
        }

        setShowFileDropOverlay(true);

        const item = items[0];

        if (items.length > 1 || item.kind !== 'file' || item.type !== 'text/plain') {
            setIsDragAndDropValid(false);
        }
    }, [dragCounter]);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current--;

        if (dragCounter.current === 0) {
            setShowFileDropOverlay(false);
            setIsDragAndDropValid(true);
        }
    }, [showFileDropOverlay, dragCounter]);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setShowFileDropOverlay(false);
        
        const files = e.dataTransfer?.files;
        dragCounter.current = 0;
        if (!isDragAndDropValid) {
            setIsDragAndDropValid(true);
            return ;
        }

        const file = files[0];
        if (await validateFn(file)) {
            onDrop(file);
        }
    }, [isDragAndDropValid, dragCounter]);

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={style}
        >
            {showFileDropOverlay
                ? <FileDropOverlay isValid={isDragAndDropValid}></FileDropOverlay>
                : null}

            {children}
        </div>
    );
}

export default FileDragAndDropContainer;
