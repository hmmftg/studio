import React from 'react';

const IranFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18">
        <rect width="24" height="6" y="0" fill="#239f40"/>
        <rect width="24" height="6" y="6" fill="#fff"/>
        <rect width="24" height="6" y="12" fill="#da0000"/>
        <g fill="#da0000">
            <path d="M9.1,8.1h1.4v1.8h-1.4z"/>
            <path d="M10.5,8.1h1.4v1.8h-1.4z"/>
            <path d="M11.9,8.1h1.4v1.8h-1.4z"/>
            <path d="M13.2,8.1h1.6L14,9l0.8-0.9h-1.6v-0.9h3v3h-0.9v-1.6l-0.8,0.8h-0.6l-0.8-0.8v1.6h-0.9z"/>
        </g>
    </svg>
);

const IraqFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18">
        <rect width="24" height="18" fill="#fff"/>
        <rect width="24" height="6" fill="#ce1126"/>
        <rect width="24" height="6" y="12" fill="#000"/>
        <text x="12" y="12.5" font-family="Kufi" font-size="7" text-anchor="middle" fill="#007a3d">الله أكبر</text>
    </svg>
);

const TurkeyFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18">
        <rect width="24" height="18" fill="#E30A17"/>
        <circle cx="9" cy="9" r="4.5" fill="#FFFFFF"/>
        <circle cx="10.5" cy="9" r="3.6" fill="#E30A17"/>
        <path d="M15 9l-1.62 1.18 0.62-1.92-1.62-1.18h2l0.62-1.92 0.62 1.92h2l-1.62 1.18 0.62 1.92z" fill="#FFFFFF"/>
    </svg>
);

const PakistanFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18">
        <rect width="24" height="18" fill="#006643"/>
        <rect width="6" height="18" fill="#FFFFFF"/>
        <circle cx="15.5" cy="9" r="3.5" fill="#FFFFFF"/>
        <path d="M16.5,9 A3,3 0 0 0 14,6.5 L15,9 Z" fill="#006643" />
        <path d="M18 7.5l-1.1.8.4-1.3-1.1-.8h1.4l.4-1.3.4 1.3h1.4l-1.1.8.4 1.3z" fill="#FFFFFF"/>
    </svg>
);

const UKFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="18">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z"/>
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
);


export const getCountryFlag = (nationality: string) => {
    switch (nationality.toLowerCase()) {
        case 'iranian':
            return <IranFlag />;
        case 'iraqi':
            return <IraqFlag />;
        case 'turkish':
            return <TurkeyFlag />;
        case 'pakistani':
            return <PakistanFlag />;
        case 'english':
            return <UKFlag />;
        default:
            return null;
    }
};
