/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '600',
                extrabold: '600',
                black: '600',
            },
    		fontFamily: {
    			serif: ['var(--ml-serif)'],
    			sans: ['var(--ml-sans)'],
    		},
    		colors: {
    			// MimaarLink brand v1.4 (brand/tailwind.brand.js), minus names already owned by shadcn.
    			navy: 'var(--ml-navy)',
    			teal: { DEFAULT: 'var(--ml-teal)', ink: 'var(--ml-teal-ink)' },
    			'pale-teal': 'var(--ml-pale-teal)',
    			night: 'var(--ml-night)',
    			'bright-teal': 'var(--ml-bright-teal)',
    			ground: 'var(--ml-ground)',
    			surface: 'var(--ml-surface)',
    			heading: 'var(--ml-heading)',
    			body: 'var(--ml-body)',
    			line: 'var(--ml-line)',
    			signature: { DEFAULT: 'var(--ml-signature-bg)', fg: 'var(--ml-signature-fg)', label: 'var(--ml-signature-label)' },
    			warn: 'var(--ml-warn)',
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		// Brand radius is 6px for buttons, inputs and cards; only pills stay fully round.
    		borderRadius: {
    			brand: 'var(--ml-radius)',
    			'3xl': 'var(--radius)',
    			'2xl': 'var(--radius)',
    			xl: 'var(--radius)',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: { brand: 'var(--ml-shadow)' },
    		transitionTimingFunction: { brand: 'var(--ml-ease)' },
    		transitionDuration: { fast: '140ms', base: '220ms', slow: '360ms' },
    		maxWidth: { content: '1200px' },
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 220ms cubic-bezier(.2,.7,.2,1)',
    			'accordion-up': 'accordion-up 220ms cubic-bezier(.2,.7,.2,1)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  }
