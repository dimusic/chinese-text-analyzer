import { Button, Checkbox } from "antd";
import { TextAnalyzerSettings } from "../../../models/text-analyzer-settings";

interface SettingsProps {
    settings: TextAnalyzerSettings;
    isRefreshRequired: boolean;
    onChange: (settings: TextAnalyzerSettings) => void;
    onApply: () => void;
}

function Settings({ settings, isRefreshRequired, onChange, onApply }: SettingsProps) {
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
        }}>
            <div style={{ marginBottom: 20 }}>
                <Checkbox
                    checked={settings.filterPunctuation}
                    onChange={(e) => onSettingChange('filterPunctuation', e.target.checked)}
                >Remove Punctuation</Checkbox>
            </div>

            {isRefreshRequired &&
                <Button type="primary" onClick={e => onApply()}>Apply</Button>}
        </div>
    );
}

export default Settings;
