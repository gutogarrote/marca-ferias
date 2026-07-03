You are designing a visual prototype for a vacation scheduling system for workers in Sao Paulo, Brazil.

The system helps a user decide when to schedule official vacation days and optional paid leave days in order to maximize or compare the total continuous time away from work, including weekends, holidays, vacation days, fixed monthly leaves, and flexible free leaves.

Do not build a production system yet. First design a clear, usable interactive prototype.

## Context

In Brazil, workers often have a fixed number of official vacation days, for example 20 days. These vacation days must be scheduled as official vacation days starting from a chosen date.

However, the actual time away from work can be longer because it may include:

- Weekends
- Public holidays
- Optional paid leave days that can be scheduled once per month
- Flexible free paid leave days that can be used on any eligible workday during the year

The current process is manual: the user creates an Excel calendar, paints cells, tests many rows/options, and calculates which vacation start date gives the longest practical break.

The prototype should replace that manual spreadsheet workflow with a visual planning interface.

## Core Inputs

The user must be able to configure:

1. `Vacation days`
   - Example: 20
   - These are official vacation days.
   - The user chooses an official vacation start date.
   - The system automatically fills the vacation days forward from that date.

2. `Fixed paid leaves per month`
   - Example: 1
   - These are optional paid leave days that are available each month.
   - The user can schedule up to this number in each month.
   - The user does not have to use them.
   - They do not carry over unless explicitly configured otherwise.

3. `Free paid leaves`
   - Example: 2
   - These are flexible leave days.
   - They can be scheduled on any eligible workday in the year.
   - Once used, they are consumed.
   - They do not need to be consecutive.

4. `Calendar location`
   - Default: Sao Paulo, Brazil.
   - The calendar should show relevant public holidays for Sao Paulo.

5. `Year`
   - The user should be able to choose the year being planned.

## Calendar Rules

The calendar should visually distinguish:

- Regular workdays
- Weekends
- Public holidays
- Official vacation days
- Fixed monthly paid leave days
- Free paid leave days
- Optional bridge days, if applicable

Weekends and public holidays should count toward the total continuous time away, but they should not consume official vacation days or leave days.

Vacation days and leave days should only be consumed on eligible workdays.

The system should make it visually obvious how many official vacation days have been used, how many fixed monthly leaves have been used, and how many free leaves remain.

## Main User Workflow

The user should be able to:

1. Enter the number of vacation days.
2. Enter the number of fixed paid leaves available per month.
3. Enter the number of free paid leaves available for the year.
4. Select the year and location, defaulting to Sao Paulo, Brazil.
5. See a full-year calendar with weekends and holidays already marked.
6. Click or drag on a date to choose the official vacation start date.
7. Have the system automatically fill the official vacation period using the configured number of vacation days.
8. Add or remove monthly paid leaves visually on the calendar.
9. Add or remove free paid leaves visually on the calendar.
10. See the resulting total continuous time away from work.
11. Save multiple scenarios/options and compare them side by side.

## Scenario Comparison

The system must support multiple vacation planning options.

Each scenario should include:

- Official vacation start date
- Official vacation end date
- Number of official vacation days consumed
- Fixed monthly leaves used
- Free leaves used
- Holidays included
- Weekends included
- Total continuous days away from work
- Start and end date of the full break, including weekends, holidays, and leaves
- Any unused leave days

The user should be able to duplicate a scenario, change the start date or leave placement, and compare the result.

The comparison view should make it easy to answer questions like:

- "If I start my vacation on October 9, how many total days away do I get?"
- "What happens if I start on October 11 instead?"
- "Where should I place my monthly paid leave to extend the break?"
- "Which option gives me the longest continuous break?"
- "Which option uses fewer extra leaves?"

## Example Scenario

Use this as a reference case.

Configuration:

- Year: a year where October and November contain holidays relevant to Sao Paulo/Brazil
- Vacation days: 20
- Fixed paid leaves per month: 1
- Free paid leaves: 2

Example option:

- The user schedules October's monthly leave on October 6.
- October 7 and 8 are weekend days.
- Official vacation starts on October 9.
- Official vacation days are filled from October 9 through October 28, consuming 20 vacation days according to the applicable workday-counting rule.
- The user uses two free leaves on October 30 and October 31.
- The user uses November's monthly leave on November 1.
- November 2 is a holiday.
- November 3, 4, and 5 extend the period through non-working days/weekend.
- The total continuous time away is 31 days.

The prototype should support this kind of visual experimentation.

## Interaction Design Requirements

The interface should be highly visual and calendar-first.

Suggested UI:

- A full-year calendar grid, grouped by month.
- Each day is a cell.
- Clear, accessible visual encoding for each day type:
  - Official vacation days
  - Public holidays
  - Weekends
  - Fixed monthly paid leave
  - Free paid leave
  - Regular workdays
- A scenario panel showing totals and warnings.
- A comparison table/list for saved scenarios.
- Drag or click interactions for selecting the vacation start date.
- Click interactions for toggling leave days.
- Clear counters for remaining vacation days, monthly leaves, and free leaves.
- Tooltips or day details when hovering/clicking a date.

Do not copy the spreadsheet colors by default. Choose a polished, accessible color system or other visual treatment that makes the day types easy to distinguish.

The prototype should avoid feeling like a generic form. The calendar should be the primary workspace.

## Important Design Questions To Resolve

When designing the prototype, explicitly decide and document:

1. Whether official vacation days are counted as calendar days or workdays.
2. Whether official vacation can start on weekends or holidays.
3. Whether fixed monthly leaves can be used before, during, or after official vacation.
4. Whether fixed monthly leaves can be used in the same month as vacation.
5. Whether free leaves can be placed before or after vacation to extend the continuous break.
6. Whether holidays are imported from a holiday API or stored as editable calendar data.
7. Whether the system should only calculate user-created scenarios or also suggest optimized scenarios automatically.

If assumptions are needed, choose sensible defaults for Sao Paulo, Brazil and make them explicit in the prototype.

## Desired Prototype Output

Produce a design for an interactive prototype that includes:

1. Main screen layout
2. Calendar interaction model
3. Scenario comparison model
4. Data model for days, scenarios, leaves, holidays, and totals
5. Calculation logic for total continuous days away
6. Edge cases and validation rules
7. Suggested visual design
8. Optional future features, such as automatic optimization

The end result should be clear enough for a developer or design agent to build a first working prototype.
