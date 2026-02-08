# UI Guidelines

## Overview
This document outlines the user interface design guidelines for the TODO application. The application shall use Material Design principles through Material-UI (MUI) components and feature an exclusive pastel color palette to create a calm, pleasant user experience.

## Design System Requirements

### 1. Component Library
- **REQUIRED**: All UI components must use Material-UI (MUI) components
- No custom components should be built if an equivalent MUI component exists
- Component variants should follow Material Design specifications
- Use MUI's theming system for consistent styling across the application

### 2. Color Palette

#### 2.1 Pastel Color Scheme
The application shall exclusively use a pastel color palette. All colors must maintain low saturation and high lightness values to create a soft, calming aesthetic.

**Primary Pastel Colors:**
- **Pastel Blue**: `#B4D4FF` - Primary actions, links, and focus states
- **Pastel Green**: `#C8E6C9` - Success states, completed tasks
- **Pastel Pink**: `#FFD6E8` - Accent elements, highlights
- **Pastel Lavender**: `#E6D5F7` - Secondary actions, badges
- **Pastel Peach**: `#FFE5CC` - Warning states, upcoming due dates
- **Pastel Coral**: `#FFB3B3` - Error states, overdue tasks

**Neutral Pastel Colors:**
- **Light Cream**: `#FFFEF9` - Background
- **Soft White**: `#F8F9FA` - Card backgrounds, elevated surfaces
- **Light Gray**: `#E8E8E8` - Borders, dividers
- **Pastel Gray**: `#C8C8C8` - Disabled states
- **Soft Charcoal**: `#6B6B6B` - Primary text
- **Medium Gray**: `#9E9E9E` - Secondary text

#### 2.2 Color Usage Guidelines
- **Backgrounds**: Use Light Cream or Soft White
- **Text**: Use Soft Charcoal for primary text, Medium Gray for secondary text
- **Buttons**: Use Pastel Blue for primary actions, Pastel Lavender for secondary actions
- **Status Indicators**:
  - Complete: Pastel Green
  - Incomplete: Pastel Blue
  - Overdue: Pastel Coral
  - Due Soon: Pastel Peach
- **Borders and Dividers**: Light Gray for subtle separation
- **Hover States**: Slightly darker shade of the base pastel color (darken by 10-15%)
- **Focus States**: Pastel Blue outline

### 3. Typography

#### 3.1 Font Family
- Use MUI's default Roboto font family
- Fallback: system fonts (-apple-system, BlinkMacSystemFont, "Segoe UI")

#### 3.2 Text Hierarchy
- **Page Title (H1)**: 32px, Medium weight (500), Soft Charcoal
- **Section Heading (H2)**: 24px, Medium weight (500), Soft Charcoal
- **Card Title (H3)**: 18px, Medium weight (500), Soft Charcoal
- **Body Text**: 16px, Regular weight (400), Soft Charcoal
- **Secondary Text**: 14px, Regular weight (400), Medium Gray
- **Caption**: 12px, Regular weight (400), Medium Gray

#### 3.3 Line Height
- Headings: 1.2
- Body text: 1.5
- Captions: 1.4

### 4. Component-Specific Guidelines

#### 4.1 Buttons
- **Component**: Use MUI `Button` component
- **Variants**:
  - Primary actions: `variant="contained"` with Pastel Blue background
  - Secondary actions: `variant="outlined"` with Pastel Lavender border
  - Tertiary actions: `variant="text"` with Pastel Blue text
- **Size**: Medium (default) for most actions, Small for compact spaces
- **Border Radius**: 8px (slightly rounded for soft appearance)
- **Text**: Capitalize (e.g., "Add Task", "Save")

#### 4.2 Input Fields
- **Component**: Use MUI `TextField` component
- **Variant**: `outlined` with Light Gray border
- **Focus State**: Pastel Blue border
- **Error State**: Pastel Coral border
- **Background**: Soft White
- **Border Radius**: 8px

#### 4.3 Cards
- **Component**: Use MUI `Card` component
- **Background**: Soft White
- **Border**: 1px solid Light Gray
- **Border Radius**: 12px
- **Shadow**: Subtle elevation (elevation={1} or elevation={2})
- **Padding**: 16px (mobile), 24px (desktop)

#### 4.4 Task List Items
- **Component**: Use MUI `ListItem` and `ListItemText` components
- **Background**: Soft White (default), Pastel Green (completed)
- **Border**: Bottom border 1px Light Gray
- **Hover**: Slightly darker background shade
- **Checkbox**: Use MUI `Checkbox` with Pastel Blue when checked

#### 4.5 Chips/Tags
- **Component**: Use MUI `Chip` component
- **Background**: Relevant pastel color based on context
- **Size**: Small for tags, Medium for status indicators
- **Border Radius**: Fully rounded (pill shape)

#### 4.6 Date Picker
- **Component**: Use MUI `DatePicker` from `@mui/x-date-pickers`
- **Calendar Colors**: Pastel Blue for selected dates
- **Input**: Follow TextField guidelines

#### 4.7 Dialogs/Modals
- **Component**: Use MUI `Dialog` component
- **Background**: Soft White
- **Backdrop**: Semi-transparent with slight blur
- **Border Radius**: 16px
- **Max Width**: sm (600px) for most dialogs

#### 4.8 Sort/Filter Controls
- **Component**: Use MUI `Select` or `ToggleButtonGroup`
- **Style**: Outlined with Pastel Blue accent
- **Active State**: Pastel Blue background

### 5. Layout and Spacing

#### 5.1 Container
- **Component**: Use MUI `Container` component
- **Max Width**: lg (1200px)
- **Padding**: 16px (mobile), 24px (tablet), 32px (desktop)

#### 5.2 Grid System
- **Component**: Use MUI `Grid` component
- **Spacing**: 2 (16px) between grid items
- **Responsive**: Follow Material Design breakpoints (xs, sm, md, lg, xl)

#### 5.3 Spacing Scale
Use MUI's spacing function based on 8px units:
- Extra Small: 8px (spacing(1))
- Small: 16px (spacing(2))
- Medium: 24px (spacing(3))
- Large: 32px (spacing(4))
- Extra Large: 48px (spacing(6))

### 6. Iconography

#### 6.1 Icon Library
- **Component**: Use MUI Icons (`@mui/icons-material`)
- **Color**: Soft Charcoal (default), Pastel colors for status/actions
- **Size**: 
  - Small: 18px
  - Medium: 24px (default)
  - Large: 32px

#### 6.2 Icon Usage
- **Add Task**: `AddCircleOutline` or `Add`
- **Delete**: `DeleteOutline`
- **Edit**: `EditOutlined`
- **Complete**: `CheckCircleOutline`
- **Incomplete**: `RadioButtonUnchecked`
- **Due Date**: `CalendarToday` or `EventNote`
- **Sort**: `Sort` or `SwapVert`
- **Filter**: `FilterList`
- **Search**: `Search`

### 7. States and Feedback

#### 7.1 Loading States
- **Component**: Use MUI `CircularProgress` or `LinearProgress`
- **Color**: Pastel Blue
- **Size**: Medium for page-level loading, Small for button loading

#### 7.2 Empty States
- **Message**: Friendly, encouraging text
- **Icon**: Large pastel-colored icon
- **Action**: Clear call-to-action button

#### 7.3 Error States
- **Component**: Use MUI `Alert` component
- **Severity**: "error" with Pastel Coral color override
- **Icon**: Included
- **Message**: Clear, actionable error description

#### 7.4 Success States
- **Component**: Use MUI `Alert` or `Snackbar` component
- **Color**: Pastel Green
- **Duration**: 3-4 seconds for auto-dismiss

### 8. Animations and Transitions

#### 8.1 Motion Guidelines
- Use MUI's transition components (`Fade`, `Slide`, `Grow`)
- Keep animations subtle and smooth (200-300ms duration)
- Avoid jarring or abrupt transitions

#### 8.2 Common Transitions
- **Page Load**: Fade in (300ms)
- **Task Add/Remove**: Slide in/out (250ms)
- **Dialog Open/Close**: Fade + Grow (225ms)
- **Hover Effects**: Instant (0ms) for color changes, 150ms for transforms

### 9. Accessibility

#### 9.1 Contrast Requirements
- Ensure all pastel colors meet WCAG AA standards for text (4.5:1 ratio)
- Use Soft Charcoal for text to maintain readability against pastel backgrounds
- Provide sufficient contrast for focus indicators

#### 9.2 Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators using Pastel Blue outline
- Logical tab order for form fields and actions

#### 9.3 Screen Reader Support
- Use semantic HTML elements
- Provide ARIA labels for icon-only buttons
- Include descriptive alt text for informative icons

#### 9.4 Touch Targets
- Minimum touch target size: 44x44px (iOS), 48x48px (Android)
- Adequate spacing between interactive elements

### 10. Responsive Design

#### 10.1 Breakpoints
- **xs**: 0-599px (mobile)
- **sm**: 600-959px (tablet portrait)
- **md**: 960-1279px (tablet landscape, small desktop)
- **lg**: 1280-1919px (desktop)
- **xl**: 1920px+ (large desktop)

#### 10.2 Mobile-First Approach
- Design for mobile first, enhance for larger screens
- Stack elements vertically on mobile, use grid on desktop
- Adjust font sizes and spacing for different screen sizes

#### 10.3 Component Adaptations
- **Mobile**: 
  - Full-width buttons
  - Larger touch targets
  - Simplified navigation
  - Bottom sheets for actions
- **Desktop**: 
  - Multi-column layouts
  - Hover states
  - Keyboard shortcuts
  - Tooltips for additional context

## Implementation Notes

### MUI Theme Configuration
Create a custom theme using `createTheme` from MUI to apply the pastel color palette globally:

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B4D4FF', // Pastel Blue
    },
    secondary: {
      main: '#E6D5F7', // Pastel Lavender
    },
    success: {
      main: '#C8E6C9', // Pastel Green
    },
    error: {
      main: '#FFB3B3', // Pastel Coral
    },
    warning: {
      main: '#FFE5CC', // Pastel Peach
    },
    background: {
      default: '#FFFEF9', // Light Cream
      paper: '#F8F9FA', // Soft White
    },
    text: {
      primary: '#6B6B6B', // Soft Charcoal
      secondary: '#9E9E9E', // Medium Gray
    },
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});
```

### Best Practices
1. Always wrap the application in MUI's `ThemeProvider`
2. Use the theme object to access colors and spacing
3. Maintain consistency by reusing existing components
4. Test colors for accessibility before implementation
5. Document any custom component styles for team reference

## Review and Updates
These guidelines should be reviewed and updated as the application evolves. All UI changes should be evaluated against these guidelines to maintain design consistency.
