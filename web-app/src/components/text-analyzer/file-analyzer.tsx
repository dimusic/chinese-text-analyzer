import { useState } from "react";
import DragAndDrop from "../../common/drag-and-drop";

enum FILE_UPLOADER_STATE {
    INIT,
    PROCESSING,
    SUCCESS,
    FAILURE,
};

function FileAnalyzer() {
    const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT);
    const processDrop = (text: string) => {
        //Simulate async request for file upload
        setTimeout(() => {
          setLoaderState(FILE_UPLOADER_STATE.PROCESSING);
        }, 1000);
        setTimeout(() => {
          setLoaderState(FILE_UPLOADER_STATE.SUCCESS);
        }, 3000);
    };

    return (
        <>
            {loaderState === FILE_UPLOADER_STATE.INIT && (
                <DragAndDrop processDrop={processDrop}>
                    <div>Drag and drop files here</div>
                </DragAndDrop>
            )}
            {loaderState === FILE_UPLOADER_STATE.PROCESSING && (
                <div className="drag-container">Processing...</div>
            )}
            {loaderState === FILE_UPLOADER_STATE.SUCCESS && (
                <div className="drag-container">File Upload done!</div>
            )}
            {loaderState === FILE_UPLOADER_STATE.FAILURE && (
                <div className="drag-container">
                File Upload failed. Please try again!
                </div>
            )}
        </>
    );
}

export default FileAnalyzer;