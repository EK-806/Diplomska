import colors from './theme.config.js';

const typo = {
    DEFAULT: {
        css: {
            '*': { margin: '0', padding: '0' },
            color: colors.foreground,
            '[class~="dark"] &': {
                color: colors.dark.foreground,
            },
            a: {
                color: colors.primary.DEFAULT,
                textDecoration: 'none',
                '[class~="dark"] &': { color: colors.dark.primary.DEFAULT },
            },
            h1: {
                color: colors.foreground,
                fontSize: '2.5rem',
                fontWeight: '600',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            h2: {
                color: colors.foreground,
                fontSize: '2rem',
                fontWeight: '600',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },

            h3: {
                color: colors.foreground,
                fontSize: '1.8rem',
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            h4: {
                color: colors.foreground,
                fontSize: '1.5rem',
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            h5: {
                color: colors.foreground,
                fontSize: '1.2rem',
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            h6: {
                color: colors.foreground,
                fontSize: '1rem',
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            input: {
                color: colors.foreground,
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            label: {
                color: colors.foreground,
                fontWeight: '500',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            strong: {
                color: colors.foreground,
                fontSize: '1.5rem',
                fontWeight: '600',
                '[class~="dark"] &': { color: colors.dark.foreground },
            },
            p: {
                color: colors.muted.foreground,
                fontSize: '1rem',
                fontWeight: '400',
                '[class~="dark"] &': { color: colors.dark.muted.foreground },
            },
            span: {
                color: colors.muted.foreground,
                fontSize: '1rem',
                fontWeight: '400',
                '[class~="dark"] &': { color: colors.dark.muted.foreground },
            },

            ul: { listStyleType: 'none' },
            ol: { listStyleType: 'none' },
            li: {
                color: colors.muted.DEFAULT,
                fontSize: '1rem',
                '[class~="dark"] &': { color: colors.dark.muted.DEFAULT },
            },
            blockquote: {
                fontStyle: 'italic',
                borderLeft: `4px solid ${colors.secondary.DEFAULT}`,
                paddingLeft: '1rem',
                marginLeft: '0',
                color: colors.secondary.DEFAULT,
                '[class~="dark"] &': { color: colors.dark.secondary.DEFAULT },
            },
            code: {
                color: colors.accent.DEFAULT,
                fontFamily: '"Fira Code", monospace',
                backgroundColor: colors.input,
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
            },
        },
    },
};

export default typo;