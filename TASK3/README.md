# Task 3 — Advanced CSS & JavaScript

A comprehensive web application demonstrating advanced CSS techniques and JavaScript functionality including responsive design, interactive components, and API integration.

## 🎯 Objectives

This project showcases advanced web development skills with the following key features:

1. **Responsive Design with Media Queries** - Mobile-first approach with breakpoints for different devices
2. **Interactive Quiz System** - Multi-question quiz with scoring and feedback
3. **Weather API Integration** - Real-time weather data fetching (with mock implementation)
4. **Image Carousel** - Rotating image gallery with navigation controls
5. **Advanced CSS Animations** - Smooth transitions and modern UI effects

## 🚀 Features

### 📱 Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Breakpoints**: Mobile (≤768px), Tablet (769px-1024px), Desktop (≥1025px)
- **Flexible grid system** that adapts to screen size
- **Touch-friendly** navigation and controls
- **Optimized typography** scaling across devices

### 🎯 Interactive Quiz
- **5 web development questions** with multiple choice answers
- **Progress tracking** showing current question and total score
- **Navigation controls** (Previous/Next/Submit)
- **Real-time scoring** and performance feedback
- **Restart functionality** to take the quiz again
- **Accessible design** with proper ARIA labels

### 🌤️ Weather API Integration
- **City search** with input validation
- **Mock API implementation** for demonstration
- **Loading states** with spinner animation
- **Error handling** for failed requests
- **Weather details** including temperature, humidity, wind speed, and pressure
- **Responsive weather display** with icons and descriptions

### 🖼️ Image Carousel
- **5 beautiful landscape images** from Unsplash
- **Auto-play functionality** with 5-second intervals
- **Manual navigation** with previous/next buttons
- **Indicator dots** for direct slide access
- **Keyboard navigation** (arrow keys)
- **Hover pause** functionality
- **Smooth transitions** between slides

### 🎨 Advanced CSS Features
- **CSS Custom Properties** (variables) for consistent theming
- **Modern color palette** with semantic naming
- **Flexbox and Grid** layouts for responsive design
- **Smooth animations** and transitions
- **Box shadows** and border radius for modern aesthetics
- **Hover effects** and interactive states
- **Loading animations** and micro-interactions

## 🛠️ Technical Implementation

### HTML Structure
- **Semantic HTML5** elements for accessibility
- **Proper heading hierarchy** (h1-h3)
- **ARIA labels** and roles for screen readers
- **Form validation** attributes
- **Responsive meta tags**

### CSS Architecture
- **Mobile-first responsive design**
- **CSS Grid** for main layout
- **Flexbox** for component layouts
- **CSS Custom Properties** for theming
- **Media queries** for breakpoints
- **Animation keyframes** for smooth transitions

### JavaScript Features
- **ES6+ Classes** for component organization
- **Async/await** for API calls
- **Event delegation** for dynamic content
- **Intersection Observer** for scroll animations
- **Debounced resize handlers**
- **Error handling** and loading states
- **Local storage** ready for data persistence

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout |
|--------|------------|---------|
| Mobile | ≤768px | Single column, stacked navigation |
| Tablet | 769px-1024px | Two-column grid, horizontal navigation |
| Desktop | ≥1025px | Two-column grid, full navigation |

## 🎨 Design System

### Colors
- **Primary**: `#3b82f6` (Blue)
- **Secondary**: `#10b981` (Green)
- **Accent**: `#f59e0b` (Orange)
- **Success**: `#22c55e` (Green)
- **Danger**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 600, 700
- **Responsive scaling** based on screen size

### Spacing
- **Consistent spacing scale** using CSS custom properties
- **Responsive padding/margins** that adapt to screen size

## 🔧 Setup Instructions

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **No build process required** - pure HTML, CSS, and JavaScript

## 🌐 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 📝 API Integration Notes

The weather functionality currently uses a **mock API implementation** for demonstration purposes. To use real weather data:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `'YOUR_API_KEY'` in `script.js` with your actual API key
3. Uncomment the real API call code and remove the mock implementation

## 🎯 Learning Outcomes

This project demonstrates:

- **Advanced CSS techniques** including Grid, Flexbox, and animations
- **JavaScript ES6+ features** like classes, async/await, and modules
- **Responsive design principles** and mobile-first development
- **API integration** and error handling
- **Accessibility best practices** and ARIA implementation
- **Performance optimization** with lazy loading and debouncing
- **Modern web development** workflows and best practices

## 🔮 Future Enhancements

Potential improvements for the project:

- **Real API integration** for weather data
- **Local storage** for quiz progress persistence
- **More quiz questions** with different categories
- **Image upload** functionality for carousel
- **Dark mode** theme toggle
- **PWA features** for offline functionality
- **Unit tests** for JavaScript components
- **Build process** with bundling and optimization

## 📄 License

This project is created for educational purposes as part of a web development learning curriculum.

---

**Created with ❤️ for advanced web development learning** 