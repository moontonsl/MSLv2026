# 🎨 MSL Philippines – Design Tokens

This document defines the global design system used across the frontend.
Do NOT hardcode hex colors in components. Always use Tailwind tokens.

---

## 🎨 Brand Colors
- Primary Brand: `brand-500`
- Hover Brand: `brand-600`
- Accent: `brand-400`

Usage:
- Button primary: `bg-brand-500 hover:bg-brand-600`
- Links: `text-brand-500`

---

## 🌑 Backgrounds
- Main Background: `bg-bg`
- Elevated Surface: `bg-bg-surface`
- Card Background: `bg-bg-card`
- Card Hover: `bg-bg-cardHover`

---

## 🧩 Text Colors
- Primary Text: `text-white`
- Secondary Text: `text-gray-400`
- Muted Text: `text-gray-500`

---

## 🏢 Department Colors
- Campus (Blue): `dept-blue-500`
- Contents (Purple): `dept-purple-500`
- General Affairs (Green): `dept-green-500`
- Operations (Red): `dept-red-500`

---

## ✅ Semantic Colors
- Success: `success-500`
- Warning: `warning-400`
- Error: `error-500`

---

## 🔘 UI Components
- Primary Button: `.btn-primary`
- Outline Button: `.btn-outline`
- Card: `.card`
- Input: `.input`

Usage:
```html
<button class="btn-primary">Submit</button>
<div class="card">Content</div>
<input class="input" />