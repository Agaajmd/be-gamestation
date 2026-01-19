export interface DurationOption {
    value: number;
    label: string;
    hours: number;
    minutes: number;
}

export function generateDurationOptions(maxDurationMinutes: number): DurationOption[] {
    const durationOptions: DurationOption[] = [];
    const minDuration = 60; // Minimum 1 jam
    const step = 30; // Step 30 menit

    for (let duration = minDuration; duration <= maxDurationMinutes; duration += step) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        let label = "";
        if (hours > 0) {
            label += `${hours} jam`;
        }
        if (minutes > 0) {
            if (hours > 0) label += " ";
            label += `${minutes} menit`;
        }

        durationOptions.push({
            value: duration,
            label,
            hours,
            minutes,
        });
    }

    return durationOptions;
}