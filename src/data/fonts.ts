// Single source of truth for all font data
export interface FontMeta {
  name: string;
  tagline: string;
  description: string;
  cssStack?: string;
}

export const FONT_DATA: FontMeta[] = [
  {
    name: "Helvetica",
    tagline: "The Subway Standard",
    description: "Designed for clarity, Helvetica became the voice of NYC's subway and a global wayfinding icon.",
    cssStack: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  {
    name: "Futura",
    tagline: "The Space Age Typeface",
    description: "Geometric and modernist, Futura captured the future, and even made it to the moon with Apollo 11!",
    cssStack: 'Futura, "Avenir Next", Avenir, Arial, sans-serif'
  },
  {
    name: "Avant Garde",
    tagline: "Magazine Modernism",
    description: "Born from Avant Garde magazine, its bold modular forms defined a radical era of editorial design.",
    cssStack: '"ITC Avant Garde Gothic", Avantgarde, sans-serif'
  },
  {
    name: "Garamond",
    tagline: "Timeless Elegance",
    description: "Classic and humanist, Garamond shaped books for centuries and fronted Apple's Think Different campaign.",
    cssStack: 'Garamond, "Adobe Garamond Pro", Georgia, serif'
  },
  {
    name: "Inter",
    tagline: "Staple of Modern Design",
    description: "A digital native, Inter balances readability with modernity, powering interfaces across the web.",
    cssStack: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  },
  {
    name: "Times New Roman",
    tagline: "The Newspaper Classic",
    description: "Commissioned for The Times, it became the default of publishing, academia, and word processors.",
    cssStack: '"Times New Roman", Times, Georgia, serif'
  }
];

// Helper function to get font data by name
export const getFontByName = (name: string): FontMeta => {
  const font = FONT_DATA.find(f => f.name === name);
  if (font) {
    return font;
  }
  
  // Fallback for unknown fonts
  return {
    name,
    tagline: 'A Beautiful Typeface',
    description: 'A distinctive typeface with unique characteristics and rich typographic heritage.',
    cssStack: 'inherit'
  };
};
