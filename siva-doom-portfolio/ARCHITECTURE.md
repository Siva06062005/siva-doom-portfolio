# Portfolio Integration Architecture

```text
Browser
  │
  ▼
React Router
  │
  ├── Navbar / Theme / Footer
  │
  ├── Home
  │    ├── Hero
  │    ├── Stats
  │    ├── Mission
  │    └── Selected Projects
  │
  ├── About
  │    ├── Profile
  │    └── Education
  │
  ├── Skills
  │    ├── Skill Groups
  │    └── Terminal Section
  │
  ├── Projects
  │    └── Project Cards
  │
  ├── Experience
  │    └── Timeline
  │
  └── Contact
       └── Contact Form
             │
             └── Connect to Formspree / EmailJS / API
```

## Production notes

- All page routing is client-side.
- All major visual components are reusable.
- All content is centralized in `src/data/portfolio.js`.
- Images are centralized through the `image` properties and `public/images`.
- No AI visual component, chatbot, model widget, or AI animation is included.
- The theme is an original armored, dark-steel, emerald and brass aesthetic rather than using Marvel character artwork, logos or assets.
- The form is intentionally frontend-only until a real email/API provider is connected.
