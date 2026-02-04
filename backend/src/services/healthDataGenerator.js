/**
 * Virtual Wearable Device Simulator
 * Generates realistic health data to simulate a connected wearable device
 */

class HealthDataGenerator {
    constructor(userId, userProfile = {}) {
        this.userId = userId;
        this.baseHeartRate = userProfile.restingHeartRate || 70;
        this.baseSteps = userProfile.dailyStepGoal || 10000;
        this.activityLevel = userProfile.activityLevel || 'moderate'; // sedentary, light, moderate, active
        this.healthConditions = userProfile.healthConditions || []; // ['hypertension', 'diabetes', etc.]

        // Circadian rhythm for realistic data
        this.currentHour = new Date().getHours();
    }

    /**
     * Generate a single health data snapshot
     */
    generateSnapshot() {
        const timestamp = new Date();
        const hour = timestamp.getHours();

        return {
            userId: this.userId,
            timestamp: timestamp.toISOString(),
            vitals: {
                heartRate: this._generateHeartRate(hour),
                bloodPressure: this._generateBloodPressure(hour),
                oxygenSaturation: this._generateSpO2(),
                temperature: this._generateTemperature(),
                respiratoryRate: this._generateRespiratoryRate()
            },
            activity: {
                steps: this._generateSteps(hour),
                caloriesBurned: this._generateCalories(hour),
                distanceKm: this._generateDistance(hour),
                activeMinutes: this._generateActiveMinutes(hour)
            },
            sleep: hour >= 22 || hour <= 6 ? this._generateSleepData(hour) : null,
            location: this._generateLocation(),
            batteryLevel: this._generateBatteryLevel()
        };
    }

    /**
     * Generate realistic heart rate based on time of day and activity
     */
    _generateHeartRate(hour) {
        let hr = this.baseHeartRate;

        // Circadian variation
        if (hour >= 6 && hour <= 9) hr += 10; // Morning rise
        else if (hour >= 10 && hour <= 16) hr += 15; // Active hours
        else if (hour >= 17 && hour <= 20) hr += 5; // Evening
        else hr -= 5; // Night/rest

        // Activity-based variation
        const activityVariation = Math.random() * 20 - 10; // ±10 bpm
        hr += activityVariation;

        // Health condition adjustments
        if (this.healthConditions.includes('hypertension')) hr += 5;
        if (this.healthConditions.includes('arrhythmia')) {
            // Occasional spikes for arrhythmia patients
            if (Math.random() < 0.1) hr += 30;
        }

        return Math.max(50, Math.min(180, Math.round(hr)));
    }

    /**
     * Generate blood pressure (systolic/diastolic)
     */
    _generateBloodPressure(hour) {
        let systolic = 120;
        let diastolic = 80;

        // Time-based variation
        if (hour >= 6 && hour <= 12) {
            systolic += 10; // Morning surge
            diastolic += 5;
        }

        // Health conditions
        if (this.healthConditions.includes('hypertension')) {
            systolic += 20;
            diastolic += 10;
        }

        // Random variation
        systolic += Math.random() * 10 - 5;
        diastolic += Math.random() * 8 - 4;

        return {
            systolic: Math.round(systolic),
            diastolic: Math.round(diastolic)
        };
    }

    /**
     * Generate oxygen saturation (SpO2)
     */
    _generateSpO2() {
        let spo2 = 98;

        if (this.healthConditions.includes('copd')) spo2 = 92;
        if (this.healthConditions.includes('asthma')) spo2 = 95;

        spo2 += Math.random() * 2 - 1; // ±1%

        return Math.max(88, Math.min(100, Math.round(spo2)));
    }

    /**
     * Generate body temperature
     */
    _generateTemperature() {
        let temp = 36.8; // Celsius

        // Circadian variation (lowest at 4 AM, highest at 6 PM)
        const hour = new Date().getHours();
        if (hour >= 4 && hour <= 6) temp -= 0.3;
        else if (hour >= 16 && hour <= 18) temp += 0.3;

        temp += Math.random() * 0.4 - 0.2; // ±0.2°C

        return parseFloat(temp.toFixed(1));
    }

    /**
     * Generate respiratory rate
     */
    _generateRespiratoryRate() {
        let rate = 16; // breaths per minute

        if (this.healthConditions.includes('asthma')) rate += 4;

        rate += Math.random() * 4 - 2; // ±2 bpm

        return Math.max(12, Math.min(25, Math.round(rate)));
    }

    /**
     * Generate step count (cumulative throughout the day)
     */
    _generateSteps(hour) {
        const targetSteps = this.baseSteps;
        const progressRatio = hour / 24;

        // More steps during waking hours
        let steps = 0;
        if (hour >= 7 && hour <= 22) {
            steps = targetSteps * progressRatio;
            steps += Math.random() * 500 - 250; // Random variation
        }

        return Math.max(0, Math.round(steps));
    }

    /**
     * Generate calories burned
     */
    _generateCalories(hour) {
        const baseCaloriesPerHour = 80; // BMR
        const activeCaloriesPerHour = 150;

        let calories = 0;
        if (hour >= 7 && hour <= 22) {
            calories = (hour - 7) * (baseCaloriesPerHour + Math.random() * activeCaloriesPerHour);
        }

        return Math.round(calories);
    }

    /**
     * Generate distance traveled
     */
    _generateDistance(hour) {
        const steps = this._generateSteps(hour);
        const avgStrideLength = 0.75; // meters
        const distance = (steps * avgStrideLength) / 1000; // km

        return parseFloat(distance.toFixed(2));
    }

    /**
     * Generate active minutes
     */
    _generateActiveMinutes(hour) {
        if (hour < 7 || hour > 22) return 0;

        const targetActive = 60; // 60 min/day goal
        const progress = (hour - 7) / 15;

        return Math.round(targetActive * progress);
    }

    /**
     * Generate sleep data (only during sleep hours)
     */
    _generateSleepData(hour) {
        const sleepStages = ['deep', 'light', 'rem', 'awake'];
        const currentStage = sleepStages[Math.floor(Math.random() * sleepStages.length)];

        return {
            stage: currentStage,
            quality: Math.round(60 + Math.random() * 30), // 60-90%
            duration: hour >= 22 ? (new Date().getHours() + 24 - 22) * 60 : hour * 60 // minutes
        };
    }

    /**
     * Generate simulated GPS location (Bengaluru area)
     */
    _generateLocation() {
        // Bengaluru coordinates with small random variation
        const baseLat = 12.9716;
        const baseLng = 77.5946;

        return {
            latitude: baseLat + (Math.random() * 0.02 - 0.01),
            longitude: baseLng + (Math.random() * 0.02 - 0.01),
            accuracy: Math.round(5 + Math.random() * 15) // meters
        };
    }

    /**
     * Generate battery level (depletes throughout day)
     */
    _generateBatteryLevel() {
        const hour = new Date().getHours();
        const hoursActive = hour >= 6 ? hour - 6 : 0;
        const batteryDrain = hoursActive * 4; // 4% per hour

        return Math.max(5, 100 - batteryDrain);
    }
}

export default HealthDataGenerator;
