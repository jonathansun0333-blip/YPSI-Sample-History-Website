/**
 * Every event on the interactive timeline, oldest first.
 *
 * Lives here rather than inside timeline-explorer.tsx so that server
 * components can read it too — the explorer is a client component, and the
 * home page needs the span of the collection without pulling the whole
 * interactive UI into its bundle. Content is typed data throughout this
 * project; see the README.
 */
export type TimelineEvent = {
  year: number;
  yearLabel: string;
  era: string;
  title: string;
  description: string;
  where: string;
  lookUp: string;
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1776,
    yearLabel: "1776",
    era: "Exploration",
    title: "De Anza expedition arrives",
    description:
      "In 1776, Spanish explorer Juan Bautista de Anza passed through the Cupertino region during an expedition to settle California. A nearby creek was named \"Arroyo San Jose de Cupertino\" after Saint Joseph of Cupertino, which later inspired the city's name.",
    where: "Cupertino region",
    lookUp: "De Anza expedition records",
  },
  {
    year: 1850,
    yearLabel: "1850",
    era: "Statehood",
    title: "California becomes a state",
    description:
      "In 1850, California was established as a state. Following the Gold Rush and new statehood, many immigrants came to the area for its rich and fertile soil, and Cupertino remained a rural farming and ranching community often called the \"West Side.\"",
    where: "West Side of Santa Clara County",
    lookUp: "California statehood records",
  },
  {
    year: 1867,
    yearLabel: "1867",
    era: "Education",
    title: "Cupertino's first school",
    description:
      "Cupertino's first school, Lincoln School, opened its earliest school building and provided education to the small community of residents living there at the time.",
    where: "Lincoln School",
    lookUp: "Local school district history",
  },
  {
    year: 1870,
    yearLabel: "1870s",
    era: "Growth",
    title: "Cupertino progresses",
    description:
      "Many American and European immigrants established family farms, wineries, vineyards, and ranches, taking advantage of the fertile soil. The De Anza Boulevard and Stevens Creek Road intersection also began development and featured early community services.",
    where: "City crossroads and farm districts",
    lookUp: "Local agricultural records",
  },
  {
    year: 1898,
    yearLabel: "1898",
    era: "Identity",
    title: "Cupertino gets a post office",
    description:
      "The name \"Cupertino\" was officially adopted and changed from \"West Side\" when the U.S. Postal Service opened a branch, solidifying the community's identity beyond a railway stop.",
    where: "Post office branch",
    lookUp: "USPS records",
  },
  {
    year: 1917,
    yearLabel: "1917",
    era: "Education",
    title: "Cupertino Union School District is established",
    description:
      "Four local schools - San Antonio, Lincoln, Doyle, and Collins - came together to establish the Cupertino Union School District. The district began with four one-room school buildings.",
    where: "Cupertino Union School District",
    lookUp: "District foundation records",
  },
  {
    year: 1924,
    yearLabel: "1924",
    era: "Parks",
    title: "Stevens Creek County Park opens",
    description:
      "Stevens Creek County Park officially opened to the public after the acquisition of 400 acres, creating the first park in the Santa Clara County Parklands System.",
    where: "Stevens Creek County Park",
    lookUp: "Santa Clara County park records",
  },
  {
    year: 1939,
    yearLabel: "1939",
    era: "Agriculture & Industry",
    title: "Peak of the 'Valley of Heart's Delight'",
    description:
      "Cupertino reached its peak as part of the world's largest fruit-producing region with orchards of prunes, cherries, peaches, nuts, and other Mediterranean crops. A deep limestone quarry and industrial cement plants also began operation in the west hills.",
    where: "Citywide and west hills",
    lookUp: "Agricultural and industrial records",
  },
  {
    year: 1955,
    yearLabel: "1955",
    era: "Cityhood",
    title: "Cupertino is incorporated as a city",
    description:
      "On October 10, Cupertino officially became Santa Clara County's 13th city with around 2,000 residents and spanning roughly four miles. Local residents pushed for cityhood and won a close vote.",
    where: "Citywide",
    lookUp: "City incorporation archives",
  },
  {
    year: 1967,
    yearLabel: "1967",
    era: "Higher Education",
    title: "De Anza College opens",
    description:
      "The 112-acre campus opened on September 11 on the historic Charles Baldwin winery estate. Its contemporary mission style with adobe walls and red tile roofs helped transform Cupertino into a modern suburban community with an educational hub.",
    where: "De Anza College campus",
    lookUp: "Foothill-De Anza district records",
  },
  {
    year: 1969,
    yearLabel: "1969",
    era: "Schools",
    title: "Monta Vista High School opens",
    description:
      "Monta Vista High School opened in the fall with only 9th and 10th grade classes to reduce crowding at nearby Homestead High School. It later became one of California's top-ranked high schools.",
    where: "Foothill area",
    lookUp: "FUHSD records",
  },
  {
    year: 1977,
    yearLabel: "1977",
    era: "Technology",
    title: "Apple Computer moves to Cupertino",
    description:
      "The young company, Apple, moved its headquarters into a small office at 20863 Stevens Creek Boulevard, marking Cupertino's transition from orchards to technology and innovation.",
    where: "20863 Stevens Creek Boulevard",
    lookUp: "Apple corporate history",
  },
  {
    year: 1993,
    yearLabel: "1993",
    era: "Technology",
    title: "Apple Infinite Loop campus opens",
    description:
      "Apple moved to the Infinite Loop campus as its previous offices had become too scattered and small. Built on land that had grown apricots a generation earlier, it became Cupertino's most recognized address for the next two decades.",
    where: "Infinite Loop",
    lookUp: "Apple corporate history",
  },
  {
    year: 2004,
    yearLabel: "2004",
    era: "Community",
    title: "Current Cupertino Library opens",
    description:
      "The current 54,000-square-foot library at 10800 Torre Avenue opened in October. It serves as an educational and social center for the Cupertino community.",
    where: "10800 Torre Avenue",
    lookUp: "Santa Clara County Library records",
  },
  {
    year: 2017,
    yearLabel: "2017",
    era: "Technology",
    title: "Apple Park opens",
    description:
      "Apple employees began moving into a massive 175-acre circular \"spaceship\" campus that became Apple's main campus for headquarters logistics and day-to-day operations.",
    where: "Apple Park Way",
    lookUp: "Apple corporate history",
  },
];

/** The earliest year the timeline covers. Derived, never typed as a literal. */
export const TIMELINE_START_YEAR = Math.min(...TIMELINE_EVENTS.map((e) => e.year));
