import { Button, Checkbox, Space } from "antd";
import { MouseEvent } from "react";
import { TextAnalyzerSettings } from "../../interface/text-analyzer-settings";


interface SettingsProps {
    settings: TextAnalyzerSettings;
    isRefreshRequired: boolean;
    onChange: (settings: TextAnalyzerSettings) => void;
    onRefresh: () => void;
}

function Settings({ settings, isRefreshRequired, onChange, onRefresh }: SettingsProps) {
    const onSettingChange = (name: string, value: any) => {
        const updatedSettings = {
            ...settings,
            [name]: value,
        };

        onChange(updatedSettings);
    };

    return (
        <div style={{
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <Space>
                <Checkbox
                    checked={settings.filterPunctuation}
                    onChange={(e) => onSettingChange('filterPunctuation', e.target.checked)}
                >Remove Punctuation</Checkbox>
            </Space>

            {isRefreshRequired &&
                <Button type="primary" onClick={e => onRefresh()}>Refresh</Button>}
        </div>
    );
}

export default Settings;