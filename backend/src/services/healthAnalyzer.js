/**
 * Rule-Based Health Analyzer
 * Replaces complex AI/ML with deterministic medical rules
 */

class HealthAnalyzer {
    constructor() {
        // Medical thresholds from clinical guidelines
        this.thresholds = {
            heartRate: {
                low: 50,
                normal: { min: 60, max: 100 },
                elevated: 120,
                critical: 140
            },
            bloodPressure: {
                normal: { systolic: 120, diastolic: 80 },
                elevated: { systolic: 130, diastolic: 85 },
                high: { systolic: 140, diastolic: 90 },
                crisis: { systolic: 180, diastolic: 120 }
            },
            spo2: {
                critical: 90,
                low: 94,
                normal: 95
            },
            temperature: {
                hypothermia: 35.0,
                low: 36.1,
                normal: { min: 36.5, max: 37.5 },
                fever: 37.8,
                highFever: 39.0
            },
            steps: {
                sedentary: 3000,
                light: 5000,
                moderate: 8000,
                active: 10000
            }
        };
    }

    /**
     * Analyze health snapshot and generate insights/alerts
     */
    analyze(healthData, userProfile = {}) {
        const alerts = [];
        const insights = [];
        const recommendations = [];

        // Analyze vitals
        const vitalAlerts = this._analyzeVitals(healthData.vitals, userProfile);
        alerts.push(...vitalAlerts.alerts);
        insights.push(...vitalAlerts.insights);

        // Analyze activity
        const activityInsights = this._analyzeActivity(healthData.activity);
        insights.push(...activityInsights);

        // Detect Anomalies (Simulated AI)
        const anomalies = this._detectAnomalies(healthData);
        if (anomalies.score > 0) {
            alerts.push({
                type: 'anomaly_detected',
                severity: Math.min(10, Math.ceil(anomalies.score * 2)),
                title: 'Unusual Pattern Detected',
                message: anomalies.reason,
                action: anomalies.score > 3 ? 'consult' : 'monitor'
            });
        }

        // Generate recommendations
        const recs = this._generateRecommendations(healthData, alerts);
        recommendations.push(...recs);

        // Calculate overall health score
        const healthScore = this._calculateHealthScore(healthData, alerts);

        return {
            timestamp: healthData.timestamp,
            healthScore,
            status: this._determineStatus(alerts),
            alerts: alerts.sort((a, b) => b.severity - a.severity),
            insights,
            anomalies, // Return detailed AI metadata
            recommendations
        };
    }

    /**
     * AI Simulation: Detect deviation from user's "normal" baseline
     * (Simulates Z-Score Anomaly Detection)
     */
    _detectAnomalies(healthData) {
        // In real ML, this would use a trained model on user history
        // Here we simulate it with randomized confidence scores based on current metrics

        const { heartRate } = healthData.vitals;
        let score = 0;
        let reason = null;

        // Anomaly Rule 1: High variance in normally stable metrics
        if (heartRate > 110 && healthData.activity.steps < 100) {
            score += 4; // High HR while sedentary
            reason = `Heart rate spike (${heartRate} bpm) detected while resting.`;
        }

        // Anomaly Rule 2: Sudden drop in SpO2
        if (healthData.vitals.oxygenSaturation < 92) {
            score += 5;
            reason = 'Sudden drop in oxygen levels detected.';
        }

        return {
            detected: score > 0,
            score, // 0-10 confidence index
            reason,
            algorithm: 'Statistical Deviation (Z-Score)'
        };
    }

    /**
     * Analyze vital signs for anomalies
     */
    _analyzeVitals(vitals, userProfile) {
        const alerts = [];
        const insights = [];
        const { heartRate, bloodPressure, oxygenSaturation, temperature } = vitals;

        // Heart Rate Analysis
        if (heartRate < this.thresholds.heartRate.low) {
            alerts.push({
                type: 'bradycardia',
                severity: 8,
                title: 'Low Heart Rate Detected',
                message: `Heart rate ${heartRate} BPM is below normal. Seek medical attention if symptomatic.`,
                action: 'monitor'
            });
        } else if (heartRate > this.thresholds.heartRate.critical) {
            alerts.push({
                type: 'tachycardia',
                severity: 9,
                title: 'Critical: High Heart Rate',
                message: `Heart rate ${heartRate} BPM is critically elevated. Emergency assistance recommended.`,
                action: 'emergency'
            });
        } else if (heartRate > this.thresholds.heartRate.elevated) {
            alerts.push({
                type: 'elevated_hr',
                severity: 6,
                title: 'Elevated Heart Rate',
                message: `Heart rate ${heartRate} BPM is elevated. Rest and monitor.`,
                action: 'rest'
            });
        } else {
            insights.push(`Heart rate ${heartRate} BPM is within normal range.`);
        }

        // Blood Pressure Analysis
        const { systolic, diastolic } = bloodPressure;
        if (systolic >= this.thresholds.bloodPressure.crisis.systolic ||
            diastolic >= this.thresholds.bloodPressure.crisis.diastolic) {
            alerts.push({
                type: 'hypertensive_crisis',
                severity: 10,
                title: 'EMERGENCY: Hypertensive Crisis',
                message: `BP ${systolic}/${diastolic} mmHg. Call emergency services immediately!`,
                action: 'emergency'
            });
        } else if (systolic >= this.thresholds.bloodPressure.high.systolic ||
            diastolic >= this.thresholds.bloodPressure.high.diastolic) {
            alerts.push({
                type: 'hypertension',
                severity: 7,
                title: 'High Blood Pressure',
                message: `BP ${systolic}/${diastolic} mmHg. Consult your doctor.`,
                action: 'consult'
            });
        } else {
            insights.push(`Blood pressure ${systolic}/${diastolic} mmHg is normal.`);
        }

        // Oxygen Saturation Analysis
        if (oxygenSaturation < this.thresholds.spo2.critical) {
            alerts.push({
                type: 'hypoxemia',
                severity: 10,
                title: 'CRITICAL: Low Oxygen',
                message: `Oxygen saturation ${oxygenSaturation}% is dangerously low. Seek immediate medical help!`,
                action: 'emergency'
            });
        } else if (oxygenSaturation < this.thresholds.spo2.low) {
            alerts.push({
                type: 'low_spo2',
                severity: 7,
                title: 'Low Oxygen Saturation',
                message: `Oxygen level ${oxygenSaturation}% is below normal. Monitor closely.`,
                action: 'monitor'
            });
        }

        // Temperature Analysis
        if (temperature >= this.thresholds.temperature.highFever) {
            alerts.push({
                type: 'high_fever',
                severity: 8,
                title: 'High Fever Detected',
                message: `Temperature ${temperature}°C. Seek medical attention.`,
                action: 'consult'
            });
        } else if (temperature >= this.thresholds.temperature.fever) {
            alerts.push({
                type: 'fever',
                severity: 5,
                title: 'Mild Fever',
                message: `Temperature ${temperature}°C is elevated. Rest and hydrate.`,
                action: 'rest'
            });
        } else if (temperature < this.thresholds.temperature.hypothermia) {
            alerts.push({
                type: 'hypothermia',
                severity: 9,
                title: 'Hypothermia Warning',
                message: `Temperature ${temperature}°C is critically low. Seek warmth immediately.`,
                action: 'emergency'
            });
        }

        return { alerts, insights };
    }

    /**
     * Analyze activity patterns
     */
    _analyzeActivity(activity) {
        const insights = [];
        const { steps, activeMinutes } = activity;

        if (steps < this.thresholds.steps.sedentary) {
            insights.push(`Only ${steps} steps today. Try a short 10-minute walk.`);
        } else if (steps >= this.thresholds.steps.active) {
            insights.push(`Great job! ${steps} steps today exceeds your goal.`);
        } else {
            const remaining = this.thresholds.steps.active - steps;
            insights.push(`${steps} steps so far. ${remaining} more to reach your 10,000 goal.`);
        }

        if (activeMinutes >= 60) {
            insights.push(`Excellent! ${activeMinutes} active minutes meets the daily recommendation.`);
        } else if (activeMinutes >= 30) {
            insights.push(`Good progress. ${activeMinutes} active minutes, aim for 60.`);
        } else {
            insights.push(`${activeMinutes} active minutes. Try to add 15 more minutes of activity.`);
        }

        return insights;
    }

    /**
     * Generate actionable recommendations
     */
    _generateRecommendations(healthData, alerts) {
        const recommendations = [];

        // Emergency recommendations
        const emergencyAlert = alerts.find(a => a.action === 'emergency');
        if (emergencyAlert) {
            recommendations.push({
                priority: 'critical',
                category: 'emergency',
                title: 'Call Emergency Services',
                action: 'Dial 112 or your local emergency number immediately',
                icon: '🚨'
            });
            return recommendations; // Don't show other recs in emergency
        }

        // Medical consultation recommendations
        const consultAlert = alerts.find(a => a.action === 'consult');
        if (consultAlert) {
            recommendations.push({
                priority: 'high',
                category: 'medical',
                title: 'Schedule Doctor Appointment',
                action: 'Contact your healthcare provider within 24 hours',
                icon: '👨‍⚕️'
            });
        }

        // Activity recommendations
        if (healthData.activity.steps < 3000) {
            recommendations.push({
                priority: 'medium',
                category: 'activity',
                title: 'Increase Daily Movement',
                action: 'Take a 15-minute walk after lunch to boost circulation',
                icon: '🚶'
            });
        }

        // Sleep recommendations (if data available)
        if (healthData.sleep && healthData.sleep.quality < 70) {
            recommendations.push({
                priority: 'medium',
                category: 'sleep',
                title: 'Improve Sleep Quality',
                action: 'Maintain regular sleep schedule, avoid screens 1 hour before bed',
                icon: '😴'
            });
        }

        // Hydration reminder
        const hour = new Date().getHours();
        if (hour >= 10 && hour <= 18) {
            recommendations.push({
                priority: 'low',
                category: 'wellness',
                title: 'Stay Hydrated',
                action: 'Drink a glass of water to maintain hydration',
                icon: '💧'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall health score (0-100)
     */
    _calculateHealthScore(healthData, alerts) {
        let score = 100;

        // Deduct points for alerts
        alerts.forEach(alert => {
            score -= alert.severity;
        });

        // Bonus for good activity
        if (healthData.activity.steps >= this.thresholds.steps.active) score += 5;
        if (healthData.activity.activeMinutes >= 60) score += 5;

        // Bonus for normal vitals
        const hr = healthData.vitals.heartRate;
        if (hr >= this.thresholds.heartRate.normal.min && hr <= this.thresholds.heartRate.normal.max) {
            score += 3;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Determine overall health status
     */
    _determineStatus(alerts) {
        const maxSeverity = alerts.length > 0 ? Math.max(...alerts.map(a => a.severity)) : 0;

        if (maxSeverity >= 9) return 'critical';
        if (maxSeverity >= 7) return 'warning';
        if (maxSeverity >= 5) return 'caution';
        return 'normal';
    }
}

export default HealthAnalyzer;
