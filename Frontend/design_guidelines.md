# Music Emotion Recognition App - Design Guidelines

## Design Approach
**Selected Approach:** Material Design with Music-Themed Customization
- Modern, utility-focused interface prioritizing ease of use and clear data visualization
- Card-based layouts with elevation and depth
- Purple/blue gradient theme creating emotional, music-inspired atmosphere
- Emphasis on smooth transitions and responsive feedback

## Color Palette

### Primary Colors
- **Primary:** 258 77% 64% (purple-blue #667eea)
- **Secondary:** 276 53% 48% (purple #764ba2)
- **Background Gradient:** Linear gradient from Primary to Secondary

### Functional Colors
- **Success:** 134 61% 41% (green #28a745)
- **Warning:** 45 100% 51% (yellow #ffc107)
- **Danger:** 354 70% 54% (red #dc3545)
- **Background:** 220 15% 10% (dark) / 0 0% 98% (light)

### Emotion-Specific Colors
- **Valence:** Green spectrum (120 60% 50%)
- **Energy:** Yellow/Orange spectrum (40 100% 60%)
- **Tension:** Red spectrum (0 70% 55%)
- **Anger:** Dark red (0 60% 40%)
- **Fear:** Purple spectrum (270 60% 50%)
- **Happy:** Bright cyan/blue (190 80% 60%)
- **Sad:** Blue spectrum (220 60% 45%)
- **Tender:** Pink spectrum (330 70% 65%)

## Typography
- **Font Family:** Modern sans-serif (Inter, Poppins, or system default)
- **Heading 1:** 3rem (48px), font-weight 700
- **Heading 2:** 2rem (32px), font-weight 600
- **Heading 3:** 1.5rem (24px), font-weight 600
- **Body:** 1rem (16px), font-weight 400
- **Caption:** 0.875rem (14px), font-weight 400

## Layout System

### Spacing Units
Use Tailwind spacing: **4, 8, 12, 16, 24, 32** units (1 unit = 0.25rem)
- Small gaps: p-4, gap-4
- Medium sections: p-8, py-12
- Large sections: py-16, py-24

### Grid System
- **Emotion Cards:** 4-column grid on desktop (lg:grid-cols-4), 2-column on tablet (md:grid-cols-2), 1-column on mobile
- **Container:** max-w-7xl with mx-auto
- **Card Spacing:** gap-6 on desktop, gap-4 on mobile

## Component Library

### File Upload Zone
- **Size:** Large prominent drop zone (min-h-96 on desktop, min-h-64 on mobile)
- **State Variations:**
  - Default: Dashed border (border-2 border-dashed), subtle purple tint background
  - Drag Over: Solid border, highlighted background, scale transform
  - Uploading: Progress bar overlay with percentage
- **Content:** Large upload icon, bold heading, supported formats list, file size limit text
- **Visual Feedback:** Smooth hover effects, drop shadow on hover

### Circular Progress Bars (Emotion Scores)
- **Size:** 120px diameter on desktop, 100px on mobile
- **Stroke Width:** 8px
- **Progress Color:** Emotion-specific color from palette
- **Background Track:** Light gray (240 10% 90% in light mode, 240 10% 20% in dark mode)
- **Center Display:** 
  - Emotion score (large, bold)
  - Scale indicator (1.0 - 7.83) below score
- **Animation:** Smooth circular fill animation from 0 to score value on mount

### Emotion Cards
- **Layout:** Card with rounded corners (rounded-xl), elevation shadow
- **Content Structure:**
  - Circular progress bar centered
  - Emotion name below circle (capitalized, font-weight 600)
  - Score value and scale displayed in circle center
- **Color Treatment:** Each card uses its emotion-specific color for the progress bar
- **Hover State:** Subtle lift animation (translate-y-1), increased shadow

### Results Section
- **Layout:** Two-column grid on desktop (charts + emotion cards)
- **Charts:** Bar chart and radar chart showing emotion profile
- **Chart Colors:** Match emotion-specific color palette
- **Spacing:** Generous padding (p-8) within cards

### Loading States
- **Upload Progress:** Linear progress bar with percentage (0-100%)
- **Processing:** Animated spinner with pulsing "Analyzing..." text
- **Skeleton Loaders:** Shimmer effect for emotion cards while loading

### Error Messages
- **Container:** Rounded card with danger color border
- **Icon:** Alert/warning icon in danger color
- **Text:** Clear error message with retry button
- **Positioning:** Centered in upload zone or as toast notification

## Animations

### Interaction Animations
- **Card Hover:** transform: translateY(-4px), transition 200ms
- **Progress Fill:** Circular progress animates over 1000ms with easeInOut
- **File Drop:** Scale pulse effect (scale 1.02) on drag over
- **Results Appear:** Stagger animation for emotion cards (100ms delay between each)

### Loading Animations
- **Spinner:** Continuous rotation
- **Progress Bar:** Smooth width transition
- **Shimmer Effect:** Gradient slide animation for skeleton loaders

## Images
No hero images required. This is a utility-focused application where the upload zone serves as the primary entry point.

## Mobile Responsiveness
- **Upload Zone:** Full-width on mobile, touch-friendly tap target (min-h-64)
- **Emotion Grid:** Single column stack on mobile, 2-column on tablet, 4-column on desktop
- **Charts:** Responsive sizing, stack vertically on mobile
- **Touch Targets:** Minimum 44px height for all interactive elements
- **Navigation:** Hamburger menu if navigation is added

## Accessibility
- **ARIA Labels:** All interactive elements labeled
- **Focus States:** Clear visible focus rings (ring-2 ring-primary)
- **Color Contrast:** Minimum 4.5:1 ratio for all text
- **Keyboard Navigation:** Full keyboard support for upload and interactions
- **Screen Reader:** Proper heading hierarchy, alt text for icons