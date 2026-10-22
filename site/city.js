// The city — every fact that makes this calendar Anchorage's rather than
// another town's, in one place (2026-10-14: built on the Omaha site's
// pattern the night it was split out of nebraska-events). The browser
// (filter.js, app.js) and the build (scripts/*.mjs) both read it; nothing
// else names a venue or a team. The shared files (app.js, filter.js,
// styles.css bar its --v-* hues, scripts/*.mjs bar fetch-events.mjs and
// sources.mjs) are lqa-events' own, byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right; the first match wins (app.js teamFor).
  // Per team:
  //   re        the title match (Ticketmaster's titles — "University of
  //             Alaska Anchorage Seawolves Hockey vs. …" — and the injected
  //             ones, "<inject.name> vs …")
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   season    where the schedule comes from: the Wolverines' from the
  //             NAHL's GameSheet gateway (kind gamesheet — the league moved
  //             its stats there; HockeyTech's NAHL feed is dead), the
  //             Seawolves' from ESPN (college hockey team 1)
  //   inject    a club whose home dates no ticket feed lists: the league's
  //             schedule puts them on the calendar under this ticket link
  //             (name = the injected title's first half). The Wolverines
  //             sell through their own Igniter box office, not Ticketmaster
  //   club      the club's name on Ticketmaster; wiki the article
  //             (teamPage: college seasons are titled "2026–27 Alaska
  //             Anchorage Seawolves men's ice hockey team"); opens when the
  //             season usually starts
  var NAHL = { league: 1148418, key: 'xtIvURA3zEEc4YZSaTDL', division: 81371 }; // GameSheet: the NAHL's league id and the league site's public partner key; the Wolverines' Midwest Division
  var TEAMS = [
    // Anchorage Wolverines, NAHL (junior A), Sullivan Arena — 28 home dates
    // a season, Friday–Saturday pairs, none on Ticketmaster
    { slug: 'wolverines', label: 'Wolverines', name: 'Anchorage Wolverines', abbr: 'ANC', re: /wolverines/i, sport: 'hockey', venue: 'Sullivan Arena', colors: ['#001727', '#9edfdf'],
      season: { kind: 'gamesheet', league: NAHL.league, key: NAHL.key, id: 523270, division: NAHL.division, leagueName: 'NAHL' }, form: { kind: 'gamesheet', league: NAHL.league, key: NAHL.key, id: 523270, division: NAHL.division },
      inject: { name: 'Anchorage Wolverines', url: 'https://tickets.anchoragewolverines.com/' },
      logo: 'https://imagedelivery.net/ErrQpIaCOWR-Tz51PhN1zA/e2be9bc9-a266-4ade-4dcf-ffd1901be200/256', schedule: 'https://www.anchoragewolverines.com/schedule/',
      club: 'Anchorage Wolverines', opens: 'mid-September', wiki: { title: 'Anchorage Wolverines' } },
    // UAA Seawolves hockey, independent (Division I), the Avis Alaska Sports
    // Complex on campus with the big weekends at the Sullivan — Ticketmaster
    // lists the home games (link-outs to the school's box office)
    { slug: 'seawolves', label: 'Seawolves', name: 'Alaska Anchorage Seawolves', abbr: 'UAA', re: /seawolves/i, sport: 'hockey', venue: 'Avis Alaska Sports Complex', colors: ['#00583d', '#ffc425'],
      espn: { sport: 'hockey', league: 'mens-college-hockey', id: '1' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/1.png', schedule: 'https://goseawolves.com/sports/mens-ice-hockey/schedule',
      club: 'University of Alaska Anchorage Seawolves Hockey', opens: 'early October', wiki: { title: "Alaska Anchorage Seawolves men's ice hockey", teamPage: true } },
  ];

  // The venues, one record each, by size. Per venue:
  //   capacity how many people the place holds
  //   area     absent = Anchorage proper (the bowl); 'town' = the Mat-Su
  //            Valley, an hour up the Glenn — the panel's second group
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). No city sweep: Ticketmaster's
  //            Anchorage market filter answers nothing. exclude drops the
  //            parking, suites and season bundles the arenas list beside
  //            their events
  //   alias    the other spellings the feeds use for it, folded to this name
  //   feed     the room's own calendar, read by scripts/feeds.mjs (kinds
  //            linked, tribe, icsfile — see there) — the rooms Ticketmaster
  //            does not list: Bear Tooth, 49th State, Mulcahy Stadium
  // Scouted and left out (README "Sources scouted"): Williwaw Social
  // (closed), CenterTix, the Anchorage Museum, the Alaska Native Heritage
  // Center (walled or scripted pages), the Alaska Airlines Center's own
  // calendar (a class-schedule plugin, nothing exported — Ticketmaster and
  // UAA's calendar cover it).
  var VENUES = {
    // --- Anchorage: the two arenas, the convention halls, the PAC, the campus rink, Koot's ---
    'Sullivan Arena': {
      capacity: 8751,
      type: 'sports',
      cssVar: '--v-sullivan',
      color: '#ea9a86',
      url: 'https://www.sullivanarena.com/', // the arena's own site was unreachable during the first build (2026-10-14)
      icon: 'https://www.google.com/s2/favicons?domain=www.anchoragewolverines.com&sz=128',
      tm: { id: 'KovZpa2Xme', match: 'sullivan', fallbackUrl: 'https://www.sullivanarena.com/', exclude: /season tickets?|parking|suite|\btours?\b/i },
      alias: /sullivan arena|george m\.? sullivan/i,
    },
    'Alaska Airlines Center': {
      capacity: 5000,
      type: 'sports',
      cssVar: '--v-aac',
      color: '#eacc86',
      url: 'https://thealaskaairlinescenter.com/events-tickets/calendar/',
      icon: 'https://www.google.com/s2/favicons?domain=thealaskaairlinescenter.com&sz=128',
      tm: { id: 'KovZ917AAK7', match: 'alaska airlines', fallbackUrl: 'https://thealaskaairlinescenter.com/events-tickets/calendar/', exclude: /season tickets?|parking|suite|\btours?\b/i },
      alias: /alaska airlines (center|arena)/i,
    },
    'Egan Center': {
      capacity: 2540,
      type: 'community',
      cssVar: '--v-egan',
      color: '#d6ea86',
      url: 'https://anchorageconventioncenters.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=anchorageconventioncenters.com&sz=128',
      tm: { id: 'KovZpZAdE17A', match: 'egan', fallbackUrl: 'https://anchorageconventioncenters.com/events/', exclude: /parking|\btours?\b/i },
      alias: /egan (civic and convention )?center|william a\.? egan/i,
    },
    "Dena'ina Center": {
      capacity: 5000,
      type: 'community',
      cssVar: '--v-denaina',
      color: '#a4ea86',
      url: 'https://anchorageconventioncenters.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=anchorageconventioncenters.com&sz=128',
      tm: { id: 'KovZpa4see', match: 'dena', fallbackUrl: 'https://anchorageconventioncenters.com/events/', exclude: /parking|\btours?\b/i },
      alias: /dena'?ina (civic and convention )?center/i,
    },
    'Atwood Concert Hall': {
      capacity: 2000,
      type: 'arts',
      cssVar: '--v-atwood',
      color: '#86ea9a',
      url: 'https://alaskapac.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=alaskapac.org&sz=128',
      tm: { id: 'KovZpZAJIekA', match: 'atwood', fallbackUrl: 'https://alaskapac.org/events', exclude: /parking|\btours?\b|season (tickets?|package)/i },
      alias: /atwood (concert )?hall/i,
    },
    'Discovery Theatre': {
      capacity: 700,
      type: 'arts',
      cssVar: '--v-discovery',
      color: '#86eacc',
      url: 'https://alaskapac.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=alaskapac.org&sz=128',
      tm: { id: 'KovZ917AixV', match: 'discovery', fallbackUrl: 'https://alaskapac.org/events', exclude: /parking|\btours?\b|season (tickets?|package)/i },
      alias: /discovery theat(er|re)/i,
    },
    'Sydney Laurence Theatre': {
      capacity: 340,
      type: 'arts',
      cssVar: '--v-sydney',
      color: '#86d6ea',
      url: 'https://alaskapac.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=alaskapac.org&sz=128',
      tm: { id: 'Z7r9jZadYM', match: 'sydney laurence', fallbackUrl: 'https://alaskapac.org/events', exclude: /parking|\btours?\b|season (tickets?|package)/i },
      alias: /sydney laurence/i,
    },
    'Avis Alaska Sports Complex': { // UAA's own rink (the Seawolf Sports Complex until 2022); the hockey link-outs
      capacity: 800,
      type: 'sports',
      cssVar: '--v-avis',
      color: '#86a4ea',
      url: 'https://goseawolves.com/sports/mens-ice-hockey/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=goseawolves.com&sz=128',
      tm: { id: 'Z7r9jZa7sF', match: 'avis alaska', fallbackUrl: 'https://goseawolves.com/sports/mens-ice-hockey/schedule', exclude: /season tickets?|parking/i },
      alias: /avis alaska|seawolf sports complex/i,
    },
    "Koot's": { // Chilkoot Charlie's in Spenard; its own site is a scripted Supabase page, so Ticketmaster alone
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-koots',
      color: '#9a86ea',
      url: 'https://koots.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=koots.com&sz=128',
      tm: { id: 'Z7r9jZa7P4', match: 'koot', fallbackUrl: 'https://koots.com/events', exclude: /parking/i },
      alias: /koot'?s|chilkoot charlie'?s/i,
    },
    'Bear Tooth Theatrepub': { // Spenard's theatre-pub stage: comedy, dance parties, drag, Parlor in the Round — a Squarespace page whose shows link to Eventbrite (feeds.mjs `linked`); its weekly trivia is a bar program, not an event
      capacity: 400,
      type: 'concert',
      cssVar: '--v-beartooth',
      color: '#eab486',
      url: 'https://www.beartoothak.com/live-events',
      icon: 'https://www.google.com/s2/favicons?domain=www.beartoothak.com&sz=128',
      feed: { kind: 'linked', url: 'https://www.beartoothak.com/live-events', match: /eventbrite\.com\/e\//, at: /bear ?tooth/i, drop: /trivia/i },
      alias: /bear ?tooth/i,
    },
    '49th State Brewing': { // the brewery's stage downtown — its Events Calendar feed carries a daily pumpkin-patch row (dropped) and, when there is one, a show
      capacity: 300,
      type: 'concert',
      cssVar: '--v-49th',
      color: '#b4ea86',
      url: 'https://www.49thstatebrewing.com/calendar/',
      icon: 'https://www.google.com/s2/favicons?domain=49thstatebrewing.com&sz=128',
      feed: { kind: 'tribe', url: 'https://49thstatebrewing.com/wp-json/tribe/events/v1/events', drop: /pumpkin patch/i },
      alias: /49th state/i,
    },
    'Mulcahy Stadium': { // the Alaska Baseball League's Anchorage ground (the Bucs and the Glacier Pilots, June–August): the league's PrestoSports calendar, every game, kept to this ground
      capacity: 3500,
      type: 'sports',
      cssVar: '--v-mulcahy',
      color: '#86eab4',
      url: 'https://alaskabaseballleague.org/composite',
      icon: 'https://www.google.com/s2/favicons?domain=alaskabaseballleague.org&sz=128',
      feed: { kind: 'icsfile', url: 'https://alaskabaseballleague.org/composite?print=ical', rooms: /mulcahy/i, type: 'sports', rename: [[/^\(Baseball\)\s*/, ''], [/\s*\(\d+-\d+\)\s*$/, '']] },
      alias: /mulcahy/i,
    },
    // --- the Mat-Su Valley: the fairgrounds in Palmer, the Menard Center in Wasilla ---
    'Alaska State Fair Grandstand': {
      capacity: 6000,
      area: 'town',
      type: 'concert',
      cssVar: '--v-grandstand',
      color: '#cc86ea',
      url: 'https://www.alaskastatefair.org/site/concerts/',
      icon: 'https://www.google.com/s2/favicons?domain=www.alaskastatefair.org&sz=128',
      tm: { id: 'KovZpZAFF7lA', match: 'grandstand', fallbackUrl: 'https://www.alaskastatefair.org/site/concerts/', exclude: /parking|gate admission|season pass/i },
      alias: /(alaska state fair )?grandstand/i,
    },
    'Borealis Theatre': {
      capacity: 2200,
      area: 'town',
      type: 'concert',
      cssVar: '--v-borealis',
      color: '#ea86d6',
      url: 'https://www.alaskastatefair.org/site/concerts/',
      icon: 'https://www.google.com/s2/favicons?domain=www.alaskastatefair.org&sz=128',
      tm: { id: 'KovZpZAFF7tA', match: 'borealis', fallbackUrl: 'https://www.alaskastatefair.org/site/concerts/', exclude: /parking|gate admission|season pass/i },
      alias: /borealis theat(er|re)/i,
    },
    'Menard Center': { // the Curtis D. Menard Memorial Sports Center, Wasilla
      capacity: 5000,
      area: 'town',
      type: 'community',
      cssVar: '--v-menard',
      color: '#ea86a4',
      url: 'https://matsu.gov/',
      icon: 'https://www.google.com/s2/favicons?domain=matsugov.us&sz=128',
      tm: { id: 'Z7r9jZa7_Z', match: 'menard', fallbackUrl: 'https://matsu.gov/', exclude: /parking/i },
      alias: /menard (memorial )?(sports )?center/i,
    },
  };

  // City-wide feeds (scripts/feeds.mjs): listings that name their room,
  // folded onto the rows above by alias. UAA's Sidearm calendar lists every
  // Seawolves team, home and away; `rooms` keeps the Alaska Airlines Center
  // dates — basketball, volleyball, gymnastics, none on Ticketmaster. Hockey
  // stays with Ticketmaster (the listing) and ESPN (the Teams view).
  var FEEDS = [
    { kind: 'icsfile', label: 'UAA Seawolves', url: 'https://goseawolves.com/calendar.ashx/calendar.ics', rooms: /alaska airlines center/i, type: 'sports',
      rename: [[/^\[[A-Z]\]\s*/, ''], [/^University of Alaska Anchorage /, 'UAA ']] },
  ];

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['Sullivan Arena', 'Alaska Airlines Center', 'Egan Center', "Dena'ina Center", 'Atwood Concert Hall', 'Discovery Theatre', 'Sydney Laurence Theatre', 'Avis Alaska Sports Complex', "Koot's", 'Bear Tooth Theatrepub', '49th State Brewing', 'Mulcahy Stadium', 'Alaska State Fair Grandstand', 'Borealis Theatre', 'Menard Center'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — the arena shows, the fair stages, Koot\'s' },
    { key: 'sports', label: 'Sports', title: 'The Wolverines, Seawolves hockey, fight nights, the Globetrotters' },
    { key: 'arts', label: 'Arts & Theater', title: 'The Performing Arts Center — Broadway tours, comedy, dance, the symphony' },
    { key: 'community', label: 'Community', title: 'Expos, markets, family days at the convention halls' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 22 slots from the first build, 25 since the three fed rooms of
  // 2026-10-15 (appended): 5 base-36 digits.
  var CODE_LENGTH = 5;
  var REGISTRY = [
    ['venue', 'Sullivan Arena'], ['venue', 'Alaska Airlines Center'], ['venue', 'Egan Center'], ['venue', "Dena'ina Center"], ['venue', 'Atwood Concert Hall'], ['venue', 'Discovery Theatre'], ['venue', 'Sydney Laurence Theatre'], ['venue', 'Avis Alaska Sports Complex'], ['venue', "Koot's"], ['venue', 'Alaska State Fair Grandstand'], ['venue', 'Borealis Theatre'], ['venue', 'Menard Center'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'wolverines'], ['team', 'seawolves'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
    ['venue', 'Bear Tooth Theatrepub'], ['venue', '49th State Brewing'], ['venue', 'Mulcahy Stadium'], // 2026-10-15
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Anchorage', // the board drops it from the clubs' names ("Anchorage Wolverines" → Wolverines)
    presetDefault: 'Every room — the Sullivan, the Alaska Airlines Center, the convention halls, the Performing Arts Center, the Valley — every team and type',
    presetNeighborhood: 'Anchorage proper only — the arenas, the halls, the PAC, the campus rink, the ballpark, Koot\'s, Bear Tooth and 49th State',
    presetBig: 'Only the places that hold 2,000 or more — the arenas, the convention halls, the Atwood and the fair stages',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing Anchorage proper only.', big: 'Showing the big rooms only — the arenas, the convention halls, the Atwood and the fair stages.' },
  };

  // Alaska's public holidays (app.js holidaysFor reads this instead of its
  // Seattle list): the federal set plus Seward's Day (the last Monday of
  // March) and Alaska Day (October 18, kept on the Monday when it falls on
  // a Sunday and the Friday when it falls on a Saturday). The October
  // Monday is Indigenous Peoples' Day here too.
  function nthWeekday(y, month, weekday, n) { var d = new Date(y, month, 1); while (d.getDay() !== weekday) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + (n - 1) * 7); return d; }
  function lastMonday(y, month) { var d = new Date(y, month + 1, 0); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; }
  function observed(d) { var o = new Date(d); if (o.getDay() === 0) o.setDate(o.getDate() + 1); else if (o.getDay() === 6) o.setDate(o.getDate() - 1); return o; }
  var HOLIDAYS = function (y) {
    return [
      [new Date(y, 0, 1), "New Year's Day"],
      [nthWeekday(y, 0, 1, 3), 'Martin Luther King Jr. Day'],
      [nthWeekday(y, 1, 1, 3), "Presidents' Day"],
      [lastMonday(y, 2), "Seward's Day"],
      [lastMonday(y, 4), 'Memorial Day'],
      [new Date(y, 5, 19), 'Juneteenth'],
      [new Date(y, 6, 4), 'Independence Day'],
      [nthWeekday(y, 8, 1, 1), 'Labor Day'],
      [nthWeekday(y, 9, 1, 2), "Indigenous Peoples' Day"],
      [observed(new Date(y, 9, 18)), 'Alaska Day'],
      [new Date(y, 10, 11), 'Veterans Day'],
      [nthWeekday(y, 10, 4, 4), 'Thanksgiving'],
      [new Date(y, 11, 25), 'Christmas Day'],
    ];
  };

  global.LQACity = {
    key: 'anchorage',
    name: 'Anchorage',
    site: 'https://anchorage.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; anchorage-events/1.0; +https://anchorage.here.events/)',
    tz: 'America/Anchorage', tzName: 'Alaska', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: 'Alaska', stateOutline: null, // no state drawing (the masthead's state strip went away 2026-10-13)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Anchorage Events', short: 'Anchorage Events', teams: 'Anchorage home teams — every season', prodid: '-//here.events//anchorage-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events in Anchorage\, AK — the Sullivan Arena\, the Alaska Airlines Center\, the Egan and Dena\'ina centers\, the Performing Arts Center and the Mat-Su Valley' },
    teams: TEAMS,
    venues: VENUES,
    feeds: FEEDS,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
    holidays: HOLIDAYS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
