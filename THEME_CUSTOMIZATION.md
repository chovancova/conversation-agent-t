# Theme Customization Guide

This application provides comprehensive theme customization capabilities, allowing users to personalize both colors and typography to suit their preferences, corporate branding, or accessibility needs.

## Color Customization

### Preset Themes

The application includes 9 professionally designed preset themes:

1. **Dark** - Modern dark theme with high contrast and cyan-green accents
2. **Light** - Clean light theme with soft colors
3. **Corporate Gold** - Professional dark theme with golden accents (universal corporate branding)
4. **Ocean** - Deep blue tones inspired by the sea
5. **Forest** - Rich green tones inspired by nature
6. **Sunset** - Warm orange and pink tones
7. **Midnight** - Deep purple and blue night tones
8. **Lavender Dream** - Soft purple and lavender tones
9. **Rose Garden** - Elegant pink and rose tones

### Custom Themes

Users can create their own custom themes using two methods:

#### 1. Palette Picker (Recommended)
- Choose from 12 predefined color palettes
- Each palette includes coordinated colors for:
  - Background
  - Card backgrounds
  - Primary actions
  - Accent elements
- Live preview shows how colors will look
- Quick and visually intuitive

#### 2. Manual Mode (Advanced)
- Full control over individual colors
- Color picker and hex input for each element
- Perfect for matching exact brand colors
- Preview updates in real-time

### How Users Choose Colors

1. Click the **Theme** button in the sidebar
2. Navigate to the **Create Custom** tab
3. Click **Create Custom Theme**
4. Choose between:
   - **Palette Picker**: Select from beautifully coordinated color schemes
   - **Manual Mode**: Pick exact colors using color pickers
5. Preview the theme with sample UI elements
6. Click **Save & Apply Theme**
7. Theme is saved and persists across sessions

## Typography Customization

### Font Family

Users can choose from 12 different fonts across three categories:

**Sans Serif** (Clean, modern reading)
- Inter (default)
- System UI
- Roboto
- Open Sans
- Poppins
- Lato

**Serif** (Traditional, elegant reading)
- Lora
- Merriweather
- Playfair Display

**Monospace** (Technical, code-like)
- JetBrains Mono
- Fira Code
- Source Code Pro

### Font Size

Three size options for optimal readability:
- **Small** (14px base) - Compact for dense information
- **Medium** (16px base) - Standard comfortable reading (default)
- **Large** (18px base) - Enhanced readability

### Line Height

Three spacing options for text lines:
- **Compact** (1.4) - Dense text for maximum content
- **Normal** (1.6) - Balanced readability (default)
- **Relaxed** (1.8) - Spacious for easier scanning

### How Users Customize Typography

1. Click the **Theme** button in the sidebar
2. Navigate to the **Typography** tab
3. Select desired **Font Family** from dropdown
4. Choose **Font Size** (Small/Medium/Large)
5. Pick **Line Height** (Compact/Normal/Relaxed)
6. Preview updates live with sample text
7. Settings save automatically and persist

## Technical Details

### Color Format
All colors use OKLCH format for consistent perceptual brightness and better color manipulation.

### Storage
- Theme selections stored in Spark KV with key `selected-theme`
- Custom theme colors stored in `custom-theme`
- Typography settings stored in `typography-settings`
- All settings persist across sessions

### Font Loading
All fonts are loaded from Google Fonts via the index.html file, ensuring consistent rendering across all browsers.

### Application
- Colors are applied by updating CSS custom properties on the document root
- Typography is applied by setting font-family, font-size, and line-height on the body element
- Changes apply instantly without page reload
