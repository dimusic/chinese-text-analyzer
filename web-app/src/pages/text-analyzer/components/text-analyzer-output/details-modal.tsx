import { Button, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface DetailsModalProps {
    title: string;
    content: string;
    visible: boolean;
    onClose: () => void;
}

function DetailsModal({ title, visible, content, onClose }: DetailsModalProps) {
    return (
        <Modal
            title={title}
            centered
            visible={visible}
            width={'100%'}
            onCancel={onClose}
            footer={[
                <Button key="close" type="default" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            <TextArea
                value={content}
                rows={6}
                readOnly={true}
            ></TextArea>
        </Modal>
    )
}

export default DetailsModal;
