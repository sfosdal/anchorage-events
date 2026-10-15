# Anchorage Events

Event feed and calendar for Anchorage, Alaska: the Sullivan Arena, the Alaska
Airlines Center, the Egan and Dena'ina convention centers, the Alaska Center
for the Performing Arts (the Atwood Concert Hall, the Discovery and Sydney
Laurence theatres), UAA's Avis Alaska Sports Complex, Koot's, the Bear Tooth
Theatrepub, 49th State Brewing and Mulcahy Stadium, with the Alaska State
Fair's Grandstand and Borealis Theatre in Palmer and the Menard Center in
Wasilla as the Mat-Su Valley group — with the home teams' seasons (the
Anchorage Wolverines of the NAHL, Seawolves hockey) in a Teams view.

Live at **https://anchorage.here.events/** (GitHub Pages, built by the Actions
workflow once a day at noon Alaska).

Built 2026-10-14 on the family's city pattern. Everything that makes this
Anchorage's is `site/city.js` (every team, venue, type, default, share-code
registry, holiday and string), `site/index.html`, `scripts/fetch-events.mjs`
(the sources), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json`, the manifest and icons. Everything else — `app.js`,
`filter.js`, `styles.css` bar its `--v-*` hue lines, the shared `scripts/*.mjs`
and their tests — is lqa-events' own, byte for byte, copied in by
`sync-shared.sh` from the lqa-events project.

The Wolverines' schedule comes from the NAHL's GameSheet gateway
(`scripts/schedules.mjs`, kind `gamesheet`, added for this city): the league's
seasons, the club's unified schedule and the division standings, read with
the league site's public partner key.

## Sources

- **Ticketmaster Discovery API** — the twelve rooms Ticketmaster lists, each
  by its venue id (every page; the Anchorage market filter answers nothing).
  Parking, suites, tours and season bundles are dropped per room
  (`tm.exclude`). Church events are left out (`isChurch`).
- **UAA's calendar** (goseawolves.com, Sidearm) — the whole athletics season
  as one iCalendar file through `scripts/feeds.mjs` (city.js `feeds`, kind
  `icsfile`), kept to the Alaska Airlines Center dates: basketball,
  volleyball, gymnastics, the tournaments it hosts. Hockey stays with
  Ticketmaster (the listing) and ESPN (the Teams view).
- **Bear Tooth Theatrepub** — its Squarespace page lists each show as a date,
  a title and a "Buy Tickets" link to Eventbrite; the links are followed and
  each Eventbrite page's schema.org Event markup read (kind `linked`). The
  weekly trivia is left out.
- **49th State Brewing** — its Events Calendar REST feed (kind `tribe`); the
  daily pumpkin-patch row is dropped, so the row waits for a real show.
- **Mulcahy Stadium** — the Alaska Baseball League's PrestoSports calendar
  (kind `icsfile`, `?print=ical`), every game, kept to this ground; the
  season runs June to August, so the row is empty until the 2027 schedule
  is posted in spring.
- **Seasons** — the NAHL's GameSheet gateway for the Wolverines (kind
  `gamesheet`), ESPN for Seawolves hockey (`scripts/schedules.mjs`).

## Build

```
cp .env.example .env   # TICKETMASTER_API_KEY=… (a free Discovery key)
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # writes site/events.json, the .ics feeds, teams.json
node --test scripts/*.test.mjs
python3 -m http.server 8000 --directory site
```

`ALLOW_NO_ARCHIVE=1` is only for the first build, before the `events-archive`
branch exists; in CI the workflow sets it as a repository variable until the
first run has pushed the archive, then it is deleted.

## Sister sites

lqa-events (Seattle Center) is the source of truth for the shared files. See
its README for the pipeline, the share codes and the Teams view.
