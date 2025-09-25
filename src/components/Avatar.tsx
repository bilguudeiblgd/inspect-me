import React, { useState } from 'react';

function hashStringToNumber(input: string): number {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) + hash) + input.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function getContrastTextColor(hexColor: string): string {
    const r = parseInt(hexColor.substring(1, 3), 16) / 255;
    const g = parseInt(hexColor.substring(3, 5), 16) / 255;
    const b = parseInt(hexColor.substring(5, 7), 16) / 255;
    const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const rl = toLinear(r), gl = toLinear(g), bl = toLinear(b);
    const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    return luminance > 0.35 ? '#111111' : '#FFFFFF';
}

function darkenHex(hexColor: string, percent: number): string {
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const p = Math.max(0, Math.min(1, percent));
    const dr = clamp(Math.round(r * (1 - p))).toString(16).padStart(2, '0');
    const dg = clamp(Math.round(g * (1 - p))).toString(16).padStart(2, '0');
    const db = clamp(Math.round(b * (1 - p))).toString(16).padStart(2, '0');
    return `#${dr}${dg}${db}`;
}

function getAvatarColors(seed: string): { background: string; foreground: string } {
    const hash = hashStringToNumber(seed || 'user');
    const hue = hash % 360;
    const saturation = 65; // vivid but not neon
    const lightness = 45; // avoid too bright/too dark
    const bg = hslToHex(hue, saturation, lightness);
    const fg = getContrastTextColor(bg);
    return { background: bg, foreground: fg };
}

function getInitials(nameOrHandle?: string | null): string {
    if (!nameOrHandle) return '?';
    const cleaned = nameOrHandle.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return nameOrHandle.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface AvatarProps {
    userHandle?: string | null;
    name?: string | null;
    imageUrl?: string | null;
    size?: number; // px
    className?: string;
    ringWidth?: number; // px
}

const Avatar: React.FC<AvatarProps> = ({ userHandle, name, imageUrl, size = 40, className, ringWidth = 2 }) => {
    const seed = (userHandle && userHandle.length >= 2 ? userHandle : (name || 'user')) as string;
    const { background, foreground } = getAvatarColors(seed);
    const ringColor = darkenHex(background, 0.4);
    const borderColor = ringColor;
    const [imgError, setImgError] = useState(false);

    const outerStyle: React.CSSProperties = {
        width: size,
        height: size,
        padding: ringWidth,
        backgroundColor: ringColor,
        borderRadius: '50%'
    };

    const innerSize = size - ringWidth * 2;

    if (imageUrl && !imgError) {
        return (
            <div className={`rounded-full ${className || ''}`} style={outerStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="User avatar"
                    width={innerSize}
                    height={innerSize}
                    style={{ width: innerSize, height: innerSize, borderRadius: '50%', display: 'block' }}
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return (
        <div className={`rounded-full ${className || ''}`} style={outerStyle}>
            <div
                className="rounded-full flex items-center justify-center select-none"
                style={{ width: innerSize, height: innerSize, backgroundColor: background, border: `2px solid ${borderColor}` }}
                aria-label={`Avatar for ${userHandle || name || 'user'}`}
                title={userHandle || name || 'user'}
            >
                <svg
                    width={Math.floor(innerSize * 0.6)}
                    height={Math.floor(innerSize * 0.6)}
                    viewBox="0 0 24 24"
                    fill={borderColor}
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-1c0-2.761-3.582-5-8-5z"/>
                </svg>
            </div>
        </div>
    );
};

export default Avatar;


