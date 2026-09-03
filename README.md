# Flash Focus UI

⚡ Flash Sales — Premium Admin UI/UX Prototype

Create a high-end, unique, modern Flash Sales management UI/UX prototype for an e-commerce Admin Panel.

IMPORTANT — STRICT SCOPE

This project is UI/UX prototype only.

DO NOT create or implement:

Database

API

Authentication

Authorization

Backend

Admin backend

Real-time stock system

Real order system

Payment integration

Server-side logic

Use only mock/static data + frontend state to demonstrate the complete experience.

🎨 DESIGN DIRECTION

Do NOT copy the visual design of Chaldal or Shwapno.

Their websites may be considered only as a general reference for understanding e-commerce concepts such as:

Product selection

Pricing

Stock

Promotions

Flash sales

The actual Admin Panel design must be completely original and visually distinct.

Create a premium React-style modern SaaS Admin UI with:

High-level animation

Smooth micro-interactions

Glassmorphism used selectively

Modern cards

Elegant data tables

Animated status badges

Smooth page transitions

Animated modal/dialog

Interactive progress indicators

Subtle hover effects

Professional typography

Strong visual hierarchy

Clean whitespace

Premium dashboard feeling

The design should feel like a modern product such as a premium SaaS/e-commerce management platform.

Avoid excessive gradients, excessive shadows, or childish animations.

🧭 SIDEBAR NAVIGATION

Create:

Marketing / Promotions

→ Flash Sales

Flash Sales should be highlighted as the active navigation item.

Sidebar should have:

Logo

Navigation icons

Collapsible sidebar interaction

Active item animation

Smooth hover transitions

⚡ FLASH SALES DASHBOARD

Page Header:

⚡ Flash Sales

Subtitle:

Create, manage and monitor limited-time product campaigns.

Top-right:

+ Create Flash Sale

KPI CARDS

Create animated KPI cards:

Active

12

Scheduled

8

Expired

24

Sold Out

6

Cards should animate when the page loads.

Use subtle number-counting animation.

🔎 FILTER & SEARCH AREA

Create a modern filter toolbar:

Search Flash Sale

Status dropdown

Date range

Product filter

Sort

Reset filters

Status filter:

All

Scheduled

Active

Expired

Cancelled

Sold Out

📋 FLASH SALES TABLE

Create a premium responsive data table.

Columns:

Campaign

Products

Start

End

Status

Sold

Remaining

Actions

Example:

Mega Weekend Flash Sale

5 Products

10 Sep 2026
8:00 PM

10 Sep 2026
10:00 PM

Status: Active

67 / 100 Sold

33 Remaining

Actions:

View

Edit

Change Status

Cancel

🟢 STATUS SYSTEM

The Flash Sale status system must support:

Scheduled

Active

Expired

Cancelled

Sold Out

IMPORTANT STATUS REQUIREMENT

Status must NOT be permanently locked.

Admin can manually change the campaign status from the UI.

For example:

Cancelled → Scheduled

Cancelled → Active

Expired → Scheduled

Scheduled → Active

Active → Cancelled

etc.

The prototype should allow Admin to choose a status freely.

🔄 REACTIVATE FEATURE

If a Flash Sale is:

Cancelled

show a prominent action:

Reactivate

Example:

Cancelled campaign card:

Weekend Flash Sale

🔴 Cancelled

Actions:

Reactivate

When clicking Reactivate:

Open an animated confirmation modal.

⚠️ STATUS CHANGE CONFIRMATION

Whenever Admin changes the Status, ALWAYS show a confirmation alert.

Example:

Admin changes:

Cancelled → Active

Show modal:

Reactivate Flash Sale?

You are about to change this Flash Sale from Cancelled to Active.

Show:

Previous Status
🔴 Cancelled

↓

New Status
🟢 Active

Buttons:

Keep Cancelled

Reactivate Flash Sale

🔔 STATUS CHANGE SUCCESS ALERT

After confirming the status change, show an elegant animated notification.

Example:

✓ Status Updated

Flash Sale status changed from Cancelled to Active.

Notification should:

Slide in smoothly

Have success icon animation

Include status transition

Automatically disappear after a few seconds

Have subtle progress indicator

🎭 STATUS CHANGE ANIMATION

Create a premium transition when status changes.

Example:

Cancelled → Active

Animation sequence:

Old status badge slightly fades/scales down.

Transition arrow appears.

New status badge scales from 90% → 100%.

Success check icon briefly animates.

Card/table row receives a subtle highlight.

Toast notification slides in.

Keep animations fast and professional.

Do NOT use excessive bouncing.

🔴 CANCELLED STATE

Cancelled campaigns should have:

Muted visual appearance

Cancelled badge

Reduced visual emphasis

Reactivate button

Example:

Flash Sale Campaign

Status:

🔴 Cancelled

Actions:

Reactivate

🟢 ACTIVE STATE

Active campaign:

Status:

🟢 Active

Show subtle animated status indicator.

Example:

● Active

The dot should have a soft pulse animation.

🟡 SCHEDULED STATE

Scheduled campaign:

Status:

🟡 Scheduled

Show countdown-style visual:

Starts in 02h 18m

Use subtle animated countdown UI with mock/static data.

⚫ EXPIRED STATE

Expired campaign:

Status:

⚫ Expired

Show:

Campaign Ended

Action:

Change Status

Admin can manually change the status if required.

🔥 SOLD OUT STATE

When Flash Sale Quantity is fully sold:

Status:

🔥 Sold Out

Show animated progress bar reaching 100%.

Example:

100 / 100 Sold

Show:

SOLD OUT

🧩 STATUS DROPDOWN

Create a premium custom status dropdown.

Example:

Current Status:

🟢 Active ▾

Dropdown:

🟡 Scheduled

🟢 Active

⚫ Expired

🔴 Cancelled

🔥 Sold Out

Each option should have:

Icon

Status color

Short description

When selecting another status, do NOT instantly change it.

First show confirmation modal.

🪄 CREATE FLASH SALE FLOW

Create a 3-step animated wizard.

Step 1

Select Products

Step 2

Configure Flash Sale

Step 3

Review & Publish

Add animated progress indicator:

01 → 02 → 03

Step transition should use smooth slide/fade animation.

STEP 1 — SELECT PRODUCTS

Allow Admin to search and select existing products using mock data.

Product cards should display:

Product image

Product name

SKU

Current Selling Price

Current Stock

Select checkbox

Example:

iPhone 15

Selling Price:
৳85,000

Stock:
25

STEP 2 — CONFIGURE

For each selected product show:

Original Price

Auto-filled mock value.

Example:

৳4,500

Read-only.

Flash Sale Price

৳3,499

Product Stock

250

Read-only.

Flash Sale Quantity

100

Per Customer Limit

2

Use modern form controls with validation states.

💰 PRICE VALIDATION

If Flash Sale Price is greater than or equal to Original Price:

Show animated inline error:

Flash Sale price must be lower than the Original Price.

Input should receive subtle error animation.

📦 QUANTITY VALIDATION

If Flash Sale Quantity is greater than Product Stock:

Show:

Flash Sale quantity cannot exceed available product stock.

⏰ TIME CONFLICT

If the same product has overlapping Flash Sales, show:

⚠️ Scheduling Conflict

This product already has an overlapping Flash Sale.

Show timeline visualization:

Flash Sale A
8:00 PM ━━━━━ 10:00 PM

Your Campaign
9:00 PM ━━━━━ 11:00 PM

Highlight the overlapping area visually.

Result:

❌ Conflict — Not Allowed

For non-overlapping campaigns:

11 Sep
8:00 PM ━━━━━ 10:00 PM

Show:

✓ Available

📦 STOCK VISUALIZATION

Create an interactive stock allocation card.

Example:

Product Stock
250

Flash Sale Allocation
100

Sold
67

Remaining
33

Normal Stock
150

Use an elegant horizontal allocation visualization.

Clearly communicate:

Flash Sale quantity is separate from the product's normal selling stock.

💰 PRICE SNAPSHOT

Create a dedicated information card:

Price Snapshot

Original Price
৳4,500

Flash Sale Price
৳3,499

Discount
22% OFF

Helper text:

Original Price is captured when the Flash Sale is created.

STEP 3 — REVIEW

Show a premium review screen.

Campaign:

Summer Mega Flash Sale

Schedule:

10 Sep 2026
8:00 PM → 10:00 PM

Products:

5

Total Flash Sale Quantity:

100

Product table:

Product

Original Price

Flash Price

Quantity

Customer Limit

Buttons:

← Back

Create Flash Sale

🎉 CREATE SUCCESS ANIMATION

After clicking Create Flash Sale:

Show a full premium success animation.

Center modal:

⚡ Flash Sale Created!

✓ Campaign successfully created.

Use:

Animated checkmark

Subtle particles/confetti

Smooth scale animation

Campaign summary

Buttons:

View Campaign

Back to Flash Sales

Keep animation elegant and short.

📊 FLASH SALE DETAILS PAGE

Create a premium campaign details dashboard.

Header:

Summer Mega Flash Sale

Status:

🟢 Active

Actions:

Edit

Change Status

Cancel

PERFORMANCE CARDS

Products

5

Flash Sale Quantity

100

Sold

67

Remaining

33

Revenue

৳234,433

Use animated number counters.

📈 SALES PROGRESS

Create an attractive progress visualization:

67 / 100 Sold

67%

Animated progress bar.

Use subtle shimmer/pulse animation while status is Active.

🛍️ PRODUCT PERFORMANCE

Table:

Product | Original | Flash Price | Qty | Sold | Remaining | Status

Example:

iPhone 15
৳85,000
৳79,999
10
7
3
Active

Sony WH-1000XM5
৳32,000
৳27,999
8
8
0
Sold Out

🛡️ DELETE PROTECTION UI

If Admin attempts to delete a product with an Active Flash Sale:

Show modal:

Product Cannot Be Deleted

This product is currently associated with an active Flash Sale.

Button:

Close

This is only a frontend prototype interaction.

🎨 ANIMATION SYSTEM

Use a consistent animation language throughout the interface.

Page Load

Fade + slight upward motion

Staggered card entrance

Cards

Subtle hover lift

Smooth shadow transition

Buttons

Hover scale around 1.01–1.02

Press feedback

Modals

Backdrop fade

Scale 95% → 100%

Smooth spring transition

Status Badge

Smooth color/state transition

Icon transition

Active status pulse

Table

Row hover animation

Status change highlight

Toast

Slide from top-right

Smooth exit

Wizard

Horizontal slide + fade

Animations should feel like a premium React application.

Use modern motion principles similar to high-quality SaaS products.

📱 RESPONSIVE DESIGN

The complete prototype must be responsive.

Desktop:

Sidebar

Large data tables

Multi-column dashboard

Tablet:

Collapsible sidebar

Responsive cards

Mobile:

Mobile navigation

Stacked cards

Horizontal scroll where necessary

Mobile-friendly modals

Touch-friendly buttons

🧪 DEMO INTERACTIONS

The prototype MUST demonstrate:

Create Flash Sale

Select multiple products

Configure pricing

Configure quantity

Configure customer limit

Set date/time

Detect time conflict

Review campaign

Create campaign

View campaign

Edit campaign

Change status

Cancel campaign

Reactivate cancelled campaign

Change Expired → Active

Change Scheduled → Active

Change Active → Cancelled

Show status confirmation alert

Show status success toast

Show Sold Out state

Show Expired state

Show validation errors

Show delete protection

All interactions should use frontend mock state only.

✨ UNIQUE DESIGN REQUIREMENT

Do NOT make this look like a generic Bootstrap/Admin template.

Create a distinctive visual identity for the Flash Sales module.

Use visual concepts such as:

Lightning-inspired UI accents

Dynamic status transitions

Campaign timeline

Animated progress

Product performance cards

Modern floating action controls

Premium modal interactions

Clean data visualization

Subtle glass/blur surfaces where appropriate

The final result should feel like a premium, modern, high-conversion e-commerce operations dashboard, while remaining professional and easy to use.

Again:

UI/UX PROTOTYPE ONLY — NO DATABASE, API, AUTHENTICATION, BACKEND OR REAL ADMIN SYSTEM.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7465b5ce-83e1-4227-a336-a66e6ebf530d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
