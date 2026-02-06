import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material';
import {
    Language as LanguageIcon,
    Check as CheckIcon
} from '@mui/icons-material';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

export function LanguageSwitcher({ variant = 'icon' }) {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        handleClose();
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    if (variant === 'button') {
        return (
            <>
                <Tooltip title="Change Language">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                    >
                        <LanguageIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {languages.map((language) => (
                        <MenuItem
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            selected={language.code === i18n.language}
                        >
                            <ListItemIcon>
                                {language.code === i18n.language && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText>
                                {language.nativeName}
                            </ListItemText>
                        </MenuItem>
                    ))}
                </Menu>
            </>
        );
    }

    return (
        <>
            <Tooltip title="Change Language">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <LanguageIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        selected={language.code === i18n.language}
                    >
                        <ListItemIcon>
                            {language.code === i18n.language && <CheckIcon fontSize="small" color="primary" />}
                        </ListItemIcon>
                        <ListItemText>
                            {language.nativeName}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
