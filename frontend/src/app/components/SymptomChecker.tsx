import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, LinearProgress, Stack, TextField } from '@mui/material';
import { AutoAwesome as AiIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export function SymptomChecker() {
    const { t } = useTranslation();
    const [symptom, setSymptom] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalyze = () => {
        if (!symptom) return;
        setAnalyzing(true);
        setResult(null);

        // Simulate AI Analysis
        setTimeout(() => {
            setAnalyzing(false);
            const lowerSymptom = symptom.toLowerCase().trim();
            const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];

            if (lowerSymptom.length < 4) {
                setResult(t('symptomChecker.results.moreDetails'));
            } else if (greetings.some(g => lowerSymptom === g || lowerSymptom.startsWith(g + ' '))) {
                setResult(t('symptomChecker.results.greeting'));
            } else if (lowerSymptom.includes('chest') || lowerSymptom.includes('heart') || lowerSymptom.includes('breath')) {
                setResult(t('symptomChecker.results.cardiac'));
            } else if (lowerSymptom.includes('head') || lowerSymptom.includes('dizz') || lowerSymptom.includes('vision')) {
                setResult(t('symptomChecker.results.neuro'));
            } else {
                setResult(t('symptomChecker.results.unknown'));
            }
        }, 2000);
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, border: '1px solid', borderColor: 'primary.light', boxShadow: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AiIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">{t('symptomChecker.title')}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {t('symptomChecker.description')}
                </Typography>

                <TextField
                    fullWidth
                    label={t('symptomChecker.label')}
                    variant="outlined"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    disabled={analyzing}
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAnalyze}
                    disabled={!symptom || analyzing}
                    startIcon={analyzing ? <CircularProgressSize16 /> : <AiIcon />}
                >
                    {analyzing ? t('symptomChecker.analyzing') : t('symptomChecker.analyzeAction')}
                </Button>

                {analyzing && <LinearProgress sx={{ mt: 2 }} />}

                {result && (
                    <Box sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: result.includes('CRITICAL') || result.includes('गंभीर') || result.includes('ತೀವ್ರ') ? 'error.50' : 'info.50',
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: result.includes('CRITICAL') || result.includes('गंभीर') || result.includes('ತೀವ್ರ') ? 'error.main' : 'info.main'
                    }}>
                        <Typography variant="subtitle2" fontWeight="bold" color={result.includes('CRITICAL') || result.includes('गंभीर') || result.includes('ತೀವ್ರ') ? 'error.main' : 'info.main'}>
                            {t('symptomChecker.resultTitle')}
                        </Typography>
                        <Typography variant="body1">
                            {result}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

const CircularProgressSize16 = () => <Box component="span" sx={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block', mr: 1 }} />;
