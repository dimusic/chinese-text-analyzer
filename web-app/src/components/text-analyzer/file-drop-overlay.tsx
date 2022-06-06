function FileDropOverlay() {
    return (
        <div style={{
            position: 'absolute',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '10px dashed #afafaf',
            color: '#fff',
        }}>
            Drop file to analyze
        </div>
    );
}

export default FileDropOverlay;