import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export default {
  darkMode: ["class", "class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundColor: {
  			primary: 'rgba(var(--bg-primary))',
  			secondary: 'rgba(var(--bg-secondary))',
  			tertiary: 'rgba(var(--bg-tertiary))',
  			disabled: 'rgba(var(--bg-disabled))',
  			component: {
  				DEFAULT: 'rgba(var(--bg-component-primary))',
  				hover: 'rgba(var(--bg-component-primary-hover))',
  				secondary: {
  					DEFAULT: 'rgba(var(--bg-component-secondary))',
  					hover: 'rgba(var(--bg-component-secondary-hover))'
  				}
  			},
  			action: {
  				DEFAULT: 'rgba(var(--bg-action-primary))',
  				hover: 'rgba(var(--bg-action-primary-hover))',
  				pressed: 'rgba(var(--bg-action-primary-pressed))',
  				secondary: {
  					DEFAULT: 'var(--bg-action-secondary)',
  					hover: 'var(--bg-action-secondary-hover)',
  					pressed: 'var(--bg-action-secondary-pressed)'
  				},
  				tertiary: {
  					DEFAULT: 'var(--bg-action-tertiary)',
  					hover: 'var(--bg-action-tertiary-hover)',
  					pressed: 'var(--bg-action-tertiary-pressed)'
  				}
  			},
  			positive: {
  				DEFAULT: 'rgba(var(--bg-positive-primary))',
  				hover: 'rgba(var(--bg-positive-primary-hover))',
  				pressed: 'rgba(var(--bg-positive-primary-pressed))',
  				secondary: {
  					DEFAULT: 'rgba(var(--bg-positive-secondary))',
  					hover: 'rgba(var(--bg-positive-secondary-hover))',
  					pressed: 'rgba(var(--bg-positive-secondary-pressed))'
  				}
  			},
  			negative: {
  				DEFAULT: 'rgba(var(--bg-negative-primary))',
  				hover: 'rgba(var(--bg-negative-primary-hover))',
  				pressed: 'rgba(var(--bg-negative-primary-pressed))',
  				secondary: {
  					DEFAULT: 'rgba(var(--bg-negative-secondary))',
  					hover: 'rgba(var(--bg-negative-secondary-hover))',
  					pressed: 'rgba(var(--bg-negative-secondary-pressed))'
  				}
  			},
  			warning: {
  				DEFAULT: 'rgba(var(--bg-warning-primary))',
  				hover: 'rgba(var(--bg-warning-primary-hover))',
  				pressed: 'rgba(var(--bg-warning-primary-pressed))',
  				secondary: {
  					DEFAULT: 'rgba(var(--bg-warning-secondary))',
  					hover: 'rgba(var(--bg-warning-secondary-hover))',
  					pressed: 'rgba(var(--bg-warning-secondary-pressed))'
  				}
  			}
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: 'rgba(var(--content-tertiary))',
  			disabled: 'rgba(var(--content-disabled))',
  			action: {
  				DEFAULT: 'rgba(var(--content-action-primary))',
  				hover: 'rgba(var(--content-action-primary-hover))',
  				pressed: 'rgba(var(--content-action-primary-pressed))',
  				on: {
  					primary: 'rgba(var(--content-action-on-primary))',
  					secondary: 'rgba(var(--content-action-on-secondary))',
  					tertiary: 'rgba(var(--content-action-on-tertiary))'
  				}
  			},
  			positive: {
  				DEFAULT: 'rgba(var(--content-positive-primary))',
  				on: {
  					primary: 'rgba(var(--content-positive-on-primary))',
  					secondary: 'rgba(var(--content-positive-on-secondary))'
  				}
  			},
  			negative: {
  				DEFAULT: 'rgba(var(--content-negative-primary))',
  				on: {
  					primary: 'rgba(var(--content-negative-on-primary))',
  					secondary: 'rgba(var(--content-negative-on-secondary))'
  				}
  			},
  			warning: {
  				DEFAULT: 'rgba(var(--content-warning-primary))',
  				on: {
  					primary: 'rgba(var(--content-warning-on-primary))',
  					secondary: 'rgba(var(--content-warning-on-secondary))'
  				}
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
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
  		borderColor: {
  			DEFAULT: 'rgba(var(--border-primary))',
  			primary: 'rgba(var(--border-primary))',
  			secondary: 'rgba(var(--border-secondary))',
  			action: 'rgba(var(--border-action))',
  			negative: {
  				DEFAULT: 'rgba(var(--border-negative-primary))',
  				secondary: 'rgba(var(--border-negative-secondary))'
  			},
  			positive: {
  				DEFAULT: 'rgba(var(--border-positive-primary))',
  				secondary: 'rgba(var(--border-positive-secondary))'
  			},
  			warning: {
  				DEFAULT: 'rgba(var(--border-warning-primary))',
  				secondary: 'rgba(var(--border-warning-secondary))'
  			},
  			disabled: 'rgba(var(--border-disabled))'
  		},
  		borderRadius: {
  			xs: '4px',
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			full: '1000px',
  			lg: 'var(--radius)'
  		},
  		fill: {
  			primary: 'rgba(var(--content-action-on-primary))',
  			secondary: 'rgba(var(--content-action-on-secondary))',
  			disabled: 'rgba(var(--content-disabled))'
  		}
  	}
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }),
      require("tailwindcss-animate")
],
} satisfies Config
