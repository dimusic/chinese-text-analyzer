import { Typography } from 'antd';

const { Text } = Typography;

interface FileDropOverlayProps {
    isValid: boolean;
}

function FileDropOverlay({ isValid }: FileDropOverlayProps) {
    const borderColor = isValid
        ? '#afafaf'
        : 'red';
    
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
            border: `10px dashed ${borderColor}`,
        }}>
            {isValid
                ? <Text strong style={{ color: '#fff' }}>Drop file to analyze</Text>
                : <Text strong type="danger">  Invalid file</Text>}
        </div>
    );
}

export default FileDropOverlay;