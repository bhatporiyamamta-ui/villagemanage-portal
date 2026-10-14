# 🌾 VillageManage - Rural Administration & Citizen Portal

A responsive web application for Village Administration, Household Demographics, and Citizen Profiling. Built with React 19, Vite, and Tailwind CSS using the palette provided in `VillageTemplate.zip`.

---

## 👥 Dual-Portal Architecture (Admin vs. Public Viewer)

Like a real-world civic application, VillageManage provides two distinct modes:

### 1. 👁️ Public Citizen & Viewer Portal (Read-Only)
* **Intended Audience**: Village citizens, local inspectors, district authorities, researchers.
* **Capabilities**:
  * **Open Transparency Dashboard**: Real-time census statistics, literacy rate, gender balance, age groups, and occupation breakdown.
  * **Public Citizen Directory**: Search and filter citizens by occupation, blood group, and demographic group.
  * **Digital Citizen ID Verification**: View and print official Panchayat Citizen ID cards with QR codes.
  * **Public Household Records**: Explore household residential dwellings, family structures, and ward allocations.
  * **Emergency Blood Donor Finder**: Life-saving public matrix to find and call matching blood donors instantly.
  * **Census CSV Download**: Export the complete village census report for public records.
* **Security & Safeguards**:
  * ❌ Cannot add or register villagers.
  * ❌ Cannot edit or delete villager profiles.
  * ❌ Cannot create, edit, or delete households.
  * ❌ Cannot access database backups or restore settings.
  * All modification functions are strictly locked and guarded at the state level.

### 2. 🛡️ Panchayat Administration Portal (Full Access)
* **Intended Audience**: Gram Panchayat Sarpanch, Talati / Panchayat Sachiv, administrative staff.
* **Capabilities**:
  * Complete full management: Register villagers, edit profiles, delete entries.
  * Create, edit, and delete household entities; assign household heads.
  * Full data management: Export/import JSON backups, export CSV, and reset sample records.
  * One-click **"Switch to Public Viewer"** button to preview exactly what citizens see.

### 🔐 Switching Between Modes
* **From Admin $\rightarrow$ Viewer**: Click the top banner link or the **"View as Public"** button in the header.
* **From Viewer $\rightarrow$ Admin**: Click **"Panchayat Staff Login"** in the top bar or header and enter the staff PIN (`Demo PIN: 1234` or use the **"One-Click Demo Admin Login"** button).

---

## 🎨 Design & Color Palette (from `VillageTemplate.zip`)

| Role | Color Hex | Sample | Description |
| :--- | :--- | :---: | :--- |
| **Text** | `#111310` | ⬛ | Dark charcoal text (WCAG AAA compliant) |
| **Background** | `#fcfdfc` | ⬜ | Off-white canvas and surfaces |
| **Primary** | `#7ab856` | 🟩 | Action buttons, active navigation, primary brand badges |
| **Secondary** | `#b0e193` | 🩵 | Card highlights, soft badge backgrounds, subtle borders |
| **Accent** | `#8be458` | 🟢 | Status pills, demographic chart bars, vibrant accents |
| **Font** | `Inter` | — | Google Font *Inter* applied throughout |

---

## 🚀 Quick Start

### Option 1: Double-Click
Double-click **`run-app.bat`** in the project root folder.

### Option 2: Command Line
```powershell
# From project root:
npm run dev

# Or directly in client:
cd client
npm run dev
```

Then open your browser to **[http://localhost:5173/](http://localhost:5173/)**.

To produce an optimized production build:
```powershell
npm run build
```
