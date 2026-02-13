"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDurationOptions = generateDurationOptions;
function generateDurationOptions(maxDurationMinutes) {
    const durationOptions = [];
    const minDuration = 60; // Minimum 1 jam
    const step = 60; // Step 60 menit
    for (let duration = minDuration; duration <= maxDurationMinutes; duration += step) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        let label = "";
        if (hours > 0) {
            label += `${hours} jam`;
        }
        if (minutes > 0) {
            if (hours > 0)
                label += " ";
            label += `${minutes} menit`;
        }
        durationOptions.push({
            value: duration,
            label,
            hours,
        });
    }
    return durationOptions;
}
//# sourceMappingURL=generateDurationOptions.js.map