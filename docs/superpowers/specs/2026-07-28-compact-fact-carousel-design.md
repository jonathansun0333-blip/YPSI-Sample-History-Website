# Compact Cupertino Fact Carousel

## Goal

Make the Cupertino fact carousel approximately 30% shorter without changing
its width, usable text width, typography, controls, or behavior.

## Design

- Keep the existing `fact-spotlight` width and horizontal spacing unchanged.
- Reduce the carousel's vertical padding from `2.4rem` to approximately
  `1.7rem` on desktop while retaining `2.4rem` horizontal padding.
- Reduce the content area's desktop minimum height from `9rem` to
  approximately `6.3rem`.
- Reduce mobile vertical padding from `2rem` to approximately `1.4rem` while
  retaining `2rem` horizontal padding.
- Reduce the mobile content minimum height from `14rem` to approximately
  `9.8rem`.
- Reserve the height of the tallest supplied fact at each responsive width
  so navigating between short and long facts never resizes the panel.
- Use overlapped, hidden, accessibility-excluded copies of the supplied
  facts as responsive size probes rather than clipping or truncating text.

## Scope

This is a component and CSS layout adjustment. It does not change the fact
data, carousel state, navigation, animation, typography, or responsive
column arrangement. Size probes are excluded from the accessibility tree.

## Verification

- Add a focused regression assertion for the new vertical and unchanged
  horizontal spacing values.
- Run the focused test and full test suite.
- Run lint and TypeScript checks.
- Build the production static export.
- Confirm the carousel width rules remain unchanged and no text is clipped.
- Confirm the shortest and longest supplied facts render at identical panel
  heights on desktop and mobile.
