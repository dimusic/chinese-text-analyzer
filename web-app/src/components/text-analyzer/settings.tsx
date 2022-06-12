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
        // <div>
            <div style={{ padding: '0 20px' }}>
                <Space>
                    <Checkbox
                        checked={settings.filterPunctuation}
                        onChange={(e) => onSettingChange('filterPunctuation', e.target.checked)}
                    >Remove Punctuation</Checkbox>

                    {isRefreshRequired &&
                        <Button type="primary" onClick={e => onRefresh()}>Refresh</Button>}
                </Space>
            </div>
        // </div>
    );
}

export default Settings;