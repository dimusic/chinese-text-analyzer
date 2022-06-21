import { Button, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { TextAnalyzerSettings } from "../../../models/text-analyzer-settings";

interface SettingsProps {
    settings: TextAnalyzerSettings;
    isRefreshRequired: boolean;
    onChange: (settings: TextAnalyzerSettings, refreshOutput: boolean) => void;
}

function Settings({ settings, isRefreshRequired, onChange }: SettingsProps) {
    const [tmpSettings, setSettings] = useState<TextAnalyzerSettings>({ filterPunctuation: true });

    useEffect(() => {
        setSettings({...settings});
    }, []);

    const onSettingChange = (name: string, value: any) => {
        const updatedSettings = {
            ...tmpSettings,
            [name]: value,
        };

        setSettings(updatedSettings);

        if (!isRefreshRequired) {
            onChange(updatedSettings, false);
        }
    };

    const handleApply = () => {
        onChange(tmpSettings, true);
    }

    return (
        <div style={{
            padding: '0 20px',
        }}>
            <div style={{ marginBottom: 20 }}>
                <Checkbox
                    checked={tmpSettings.filterPunctuation}
                    onChange={(e) => onSettingChange('filterPunctuation', e.target.checked)}
                >Remove Punctuation</Checkbox>
            </div>

            {isRefreshRequired &&
                <Button type="primary" onClick={handleApply}>Apply</Button>}
        </div>
    );
}

export default Settings;
