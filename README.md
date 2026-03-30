# WEB103 Project 4 - Bolt Bucket 🏎️

Submitted by: **Raymond Frimpong Amoateng**

About this web app: **Bolt Bucket is a premier supercar personalizer designed for the Corvette C8. It provides a high-performance configuration experience where users can select exterior colors, roofs, wheels, and interiors. The app features real-time color updates, dynamic pricing (MSRP), and advanced feature validation to prevent impossible builds. Built with a React/Vite frontend and a Node/Express/PostgreSQL backend.**

Time spent: **15** hours

## Required Features

The following **required** functionality is completed:

- [X] **The web app uses React to display data from the API.**
- [X] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [X] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [X] **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [X] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [X] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [X] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [X] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [X] **The visual interface changes in response to at least one customizable feature.**
- [X] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [X] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [X] **Users can view a list of all submitted `CustomItem`s.**
- [X] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can update or delete `CustomItem`s that have been created from the detail page.**

The following **optional** features are implemented:

- [X] **Selecting particular options prevents incompatible options from being selected even before form submission** (Implemented with real-time "Conflict" warnings in selection modals).

The following **additional** features are implemented:

- [X] **Custom Deletion Modal**: Replaced native popups with a themed confirmation modal for a premium UX.
- [X] **High-Performance "Exemplar" Design**: Implemented a minimalist Red/Black aesthetic with glassmorphism components.

## Video Walkthrough

Here's a walkthrough of implemented required features:

![Bolt Bucket Walkthrough](file:///Users/ray/.gemini/antigravity/brain/45aa7410-964c-41a7-9a52-b9a159bc2dd7/verify_custom_delete_modal_1774853177531.webp)

### Database Verification

To view the table contents via terminal, run:
`PGPASSWORD="R21nT8gziUebXkvzK3qRa7SHYocbL13b" psql -h dpg-d7490b7fte5s73bcac8g-a.oregon-postgres.render.com -U magma -d carshow -c "SELECT * FROM custom_items;"`

## Notes

Challenges included ensuring the complex feature-combination validation remained in sync between the client and server. Implementing the pre-selection conflict indicator in the modals required careful state management to provide real-time feedback without blocking the user flow.

## License

Copyright [2026] [Raymond Frimpong Amoateng]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
