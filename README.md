# Shopify Dawn Theme Customization - Technical Evaluation

This repository contains the custom Shopify sections and features developed for the frontend coding evaluation on the **Dawn** theme.

---

## 🌐 Live Store Preview & Access

* **Direct Preview Page URL:** [https://ahmed-ismael-48-teststore.myshopify.com/pages/figma-test-1](https://ahmed-ismael-48-teststore.myshopify.com/pages/figma-test-1)
* **Store Password:** `123`

---

## 🚀 Implemented Sections & Features

### 1. Custom Banner Section (`custom-banner.liquid`)
- Built entirely from scratch following a pixel-perfect design from Figma without relying on ready-made Dawn sections.
- Configurable settings via the Shopify Theme Customizer (editable headings, descriptions, image illustrations, button label, and link).
- Styled cleanly using a dedicated external CSS file (`assets/custom-banner.css`).

### 2. Custom Grid Section & Interactive Modal (`custom-grid.liquid`)
- Displays a 6-product grid matching the provided Figma layout.
- **Vanilla JavaScript Modal/Popup:** Clicking the `(+)` button opens a dynamic modal overlay on the same page without a page refresh.
- **Dynamic Variant Selection:** Allows selecting Color and Size variants cleanly with live updates.
- Built with **100% Vanilla JavaScript (ES6+)** with no jQuery dependencies (`assets/custom-popup.js`).

### 3. Ajax Add to Cart & Special Conditional Logic 🚨
- Implemented using the Shopify Ajax API (`fetch` to `/cart/add.js`) without default form redirects.
- **Conditional Rule Executed:** When a user selects **Color = "Black"** AND **Size = "Medium"**, the cart request automatically adds two items:
  1. The selected product variant.
  2. The **"Soft Winter Jacket"** variant.
- Selecting any other option combination adds only the selected product variant as required.

---

## 🛠️ Tech Stack & Architecture
- **Shopify Liquid:** Clean schema definitions and modular section structuring.
- **Vanilla JavaScript (ES6+):** Highly efficient, well-commented, and modular logic.
- **CSS3:** Separate asset stylesheets following Dawn theme best practices.
