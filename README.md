# Anchorage Events

Event feed and calendar for Anchorage, Alaska: the Sullivan Arena, the Alaska
Airlines Center, the Egan and Dena'ina convention centers, the Alaska Center
for the Performing Arts (the Atwood Concert Hall, the Discovery and Sydney
Laurence theatres), UAA's Avis Alaska Sports Complex and Koot's, with the
Alaska State Fair's Grandstand and Borealis Theatre in Palmer and the Menard
Center in Wasilla as the Mat-Su Valley group — with the home teams' seasons
(the Anchorage Wolverines of the NAHL, Seawolves hockey) in a Teams view.

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
