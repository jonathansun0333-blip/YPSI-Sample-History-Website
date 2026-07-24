export type ArchiveAudioTrack = {
  label: string;
  src: string;
};

export type ArchiveEntry = {
  slug: string;
  mediaType: "Audio" | "Audio Collection";
  duration: string;
  title: string;
  narrators: string;
  metadata: string;
  summary: string;
  audioTracks?: ArchiveAudioTrack[];
  era: string;
  category: string;
  story: string;
};

export const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    slug: "vallco-before-the-demolition",
    mediaType: "Audio Collection",
    duration: "~6:00",
    title: "Vallco Before the Demolition",
    narrators: "Jonathan Hwang and Long Jiao",
    metadata: "audio collection · ~6:00 oral history · YPSI interviews",
    summary: "Two residents remember Vallco Mall as a place for arcade games, movies, shopping, family outings, and ordinary errands before its demolition.",
    audioTracks: [
      {
        label: "Jonathan Hwang",
        src: "/audio/archive/jonathan-hwang.m4a",
      },
      {
        label: "Long Jiao",
        src: "/audio/archive/long-jiao.m4a",
      },
    ],
    era: "Early 1980s—2021",
    category: "local history",
    story: "Jonathan Hwang grew up in Cupertino from the early 1980s through the late 1990s. He remembers Vallco Mall’s Tilt arcade, where children could play video games, collect tickets, and spend time with friends. Long Jiao later visited Vallco to shop, purchase household appliances, watch movies, and spend time with his family. He witnessed the mall’s purchase and demolition and reflected on the years in which the property remained undeveloped. Together, their memories preserve Vallco not simply as a commercial center, but as an important part of everyday life in Cupertino.",
  },
  {
    slug: "growing-up-on-cupertinos-trails",
    mediaType: "Audio",
    duration: "3:29",
    title: "Growing Up on Cupertino’s Trails",
    narrators: "Jonathan Hwang",
    metadata: "audio · 3:29 oral history · interviewed by Uriah Chen",
    summary: "A former resident remembers Cupertino schools, neighborhood bike rides, mountain trails, Vallco Mall, and returning to the city with his daughter.",
    audioTracks: [
      {
        label: "Jonathan Hwang",
        src: "/audio/archive/jonathan-hwang.m4a",
      },
    ],
    era: "Early 1980s—Late 1990s",
    category: "childhood",
    story: "Jonathan Hwang attended Regnart Elementary School, Kennedy Junior High School, and Monta Vista High School while growing up in Cupertino. His childhood memories include biking around his neighborhood, exploring nearby mountain-bike trails, and visiting the Tilt arcade at Vallco Mall. Years later, he returned to the Cupertino Library with his daughter, connecting his own childhood with hers. He describes Cupertino as a place where nature, schools, technology, friendship, and family life exist close together.",
  },
  {
    slug: "from-taiwan-to-a-second-home",
    mediaType: "Audio",
    duration: "3:18",
    title: "From Taiwan to a Second Home",
    narrators: "Amy Su",
    metadata: "audio · 3:18 oral history · interviewed by Uriah Chen",
    summary: "Amy Su reflects on immigrating from Taipei in 1997 and on three generations of her family volunteering in Cupertino.",
    audioTracks: [
      {
        label: "Amy Su",
        src: "/audio/archive/amy-su.m4a",
      },
    ],
    era: "1997—Now",
    category: "immigration",
    story: "Amy Su’s family moved from Taiwan to the United States in 1997 after her father’s job was transferred. Coming from Taipei, she initially found Cupertino surprisingly quiet and rural, with businesses closing much earlier than the street markets she knew in Taiwan. Over time, she watched the city become more developed, diverse, and academically competitive. Cupertino became her family’s second home. Her parents, siblings, children, and Amy herself participated in food-bank outreach, nursing-home visits, Chinese school, community events, and Asian American organizations. She encourages immigrants to listen patiently to different perspectives and contribute to the community they now share.",
  },
  {
    slug: "apple-park-from-proposal-to-landmark",
    mediaType: "Audio",
    duration: "2:17",
    title: "Apple Park: From Proposal to Landmark",
    narrators: "Dajao",
    metadata: "audio · 2:17 oral history · interviewed by Uriah Chen",
    summary: "A Cupertino worker reflects on seeing Apple Park completed after the project was introduced to the city government.",
    audioTracks: [
      {
        label: "Dajao",
        src: "/audio/archive/dajao.m4a",
      },
    ],
    era: "2013—Now",
    category: "technology",
    story: "Dajao has commuted from Santa Clara to work in Cupertino since 2013. One of his strongest memories is visiting Apple Park after its construction was completed. He connects the finished campus with Steve Jobs’s earlier presentation of the project to the Cupertino City Council and sees the building as the product of years of planning and collective effort. For him, Apple Park represents Cupertino’s relationship with technology, employment, civic decision-making, and large-scale urban development.",
  },
  {
    slug: "cherry-blossom-festival-and-belonging",
    mediaType: "Audio",
    duration: "1:42",
    title: "Cherry Blossom Festival and Belonging",
    narrators: "Michelle Kim",
    metadata: "audio · 1:42 oral history · interviewed by Uriah Chen",
    summary: "A family’s first visit to Cupertino’s Cherry Blossom Festival helped them see the city as a place where different cultures could gather and belong.",
    audioTracks: [
      {
        label: "Michelle Kim",
        src: "/audio/archive/michelle-kim.m4a",
      },
    ],
    era: "2012—Now",
    category: "community events",
    story: "Before Michelle Kim’s family moved to Cupertino, they attended the city’s Cherry Blossom Festival around 2012 or 2013. They were excited to find a nearby cultural festival rather than traveling to San Francisco. Her family explored booths, watched performances, and enjoyed food and snacks together. The experience became an annual family tradition whenever they were able to attend. Michelle describes community as more than living near one another: it means looking out for and caring for people beyond one’s own household.",
  },
  {
    slug: "closing-the-digital-and-generational-divide",
    mediaType: "Audio",
    duration: "2:41",
    title: "Closing the Digital and Generational Divide",
    narrators: "Phil Sun",
    metadata: "audio · 2:41 oral history · interviewed by Uriah Chen",
    summary: "Phil Sun proposes a nonprofit through which young people and seniors could teach one another and build relationships through technology.",
    audioTracks: [
      {
        label: "Phil Sun",
        src: "/audio/archive/phil-sun.m4a",
      },
    ],
    era: "2025—Now",
    category: "volunteering",
    story: "Inspired by Cupertino’s students, seniors, educators, and technology professionals, Phil Sun began planning a nonprofit in 2025. His idea is to pair children with older adults so that young people can help seniors learn to use cellphones, artificial intelligence, and other digital tools. At the same time, the program would create opportunities for both generations to learn from one another. Phil sees the project as a way to address both the digital divide and the generational divide while strengthening relationships among neighbors.",
  },
  {
    slug: "building-for-west-valley-community-services",
    mediaType: "Audio",
    duration: "1:59",
    title: "Building for West Valley Community Services",
    narrators: "Garrett Kai",
    metadata: "audio · 1:59 oral history · interviewed by Uriah Chen",
    summary: "An Eagle Scout describes constructing new communication boards for a Cupertino nonprofit serving residents in need.",
    audioTracks: [
      {
        label: "Garrett Kai",
        src: "/audio/archive/garrett-kai.m4a",
      },
    ],
    era: "May—August 2025",
    category: "youth service",
    story: "Garrett Kai completed an Eagle Scout project for West Valley Community Services, a nonprofit that provides services such as food assistance and support for unhoused and underprivileged residents. From early May through the middle of August, he built five boards for the organization’s facilities. The project included three enclosed sliding-door bulletin boards and two magnetic whiteboards, along with new lobby lettering and decorations. His work created practical spaces where the organization could display information and communicate with the people it serves.",
  },
  {
    slug: "biking-to-the-library-with-my-son",
    mediaType: "Audio",
    duration: "1:56",
    title: "Biking to the Library with My Son",
    narrators: "David Ranslan",
    metadata: "audio · 1:56 oral history · interviewed by William Zhang",
    summary: "A father remembers weekly library visits and bicycle rides with his son while reflecting on the cost of raising a family in Cupertino.",
    audioTracks: [
      {
        label: "David Ranslan",
        src: "/audio/archive/david-ranslan.m4a",
      },
    ],
    era: "2020—Now",
    category: "family",
    story: "David Ranslan has lived in Cupertino since 2020. His family visits the Cupertino Library approximately once a week and also spends time at Barnhart Park and Wilson Park. His favorite memory is riding bicycles to the library with his son, Seneca. The routine represents what he values about Cupertino as a place for families: accessible public spaces, parks, and opportunities to spend time together. At the same time, he wishes the city were less expensive and more financially accessible to families.",
  },
  {
    slug: "a-childhood-summer-at-the-library-fountains",
    mediaType: "Audio",
    duration: "1:22",
    title: "A Childhood Summer at the Library Fountains",
    narrators: "Hannie Du",
    metadata: "audio · 1:22 oral history · interviewed by Uriah Chen",
    summary: "A lifelong resident recalls cooling off in the fountains outside the Cupertino Library on a hot summer day.",
    audioTracks: [
      {
        label: "Hannie Du",
        src: "/audio/archive/hannie-du.m4a",
      },
    ],
    era: "2000s—2010s",
    category: "childhood",
    story: "Hannie Du was born in Cupertino and grew up surrounded by the city’s trees, mild weather, and public spaces. One of her clearest memories is of visiting the Cupertino Library with her mother during a hot summer day. She played in the fountains outside the building, where the water offered relief from the heat. The brief moment became a lasting childhood memory and illustrates how an ordinary public feature can become part of a resident’s personal history.",
  },
  {
    slug: "the-library-fish-tank",
    mediaType: "Audio Collection",
    duration: "~6:00",
    title: "The Library Fish Tank",
    narrators: "Tony Fei, Jonathan Hwang, Yona Lee, and Cupertino families",
    metadata: "audio collection · multiple interviews oral history · YPSI interviews",
    summary: "Several families remember the Cupertino Library aquarium as a childhood destination and a familiar part of their visits.",
    audioTracks: [
      {
        label: "Tony Fei",
        src: "/audio/archive/tony-fei.m4a",
      },
      {
        label: "Jonathan Hwang",
        src: "/audio/archive/jonathan-hwang.m4a",
      },
      {
        label: "Yona Lee",
        src: "/audio/archive/yona-lee.m4a",
      },
    ],
    era: "2000s—2020s",
    category: "library",
    story: "Across several interviews, the library’s fish tank appears repeatedly in family memories. Tony Fei remembers bringing his baby to see it before it was removed. Jonathan Hwang returned to the library because his daughter enjoyed the fish tank. Yona Lee remembers completing summer math work with her daughter beside the aquarium before visiting the neighboring coffee shop. These stories show how a small feature inside a public building became part of family routines, childhood outings, educational experiences, and residents’ memories of a changing library.",
  },
  {
    slug: "the-cost-of-staying-in-cupertino",
    mediaType: "Audio Collection",
    duration: "~11:00",
    title: "The Cost of Staying in Cupertino",
    narrators: "Peter Choo, Nicole Fan, David Ranslan, Kai Kunurat, and Ben Dong",
    metadata: "audio collection · multiple interviews oral history · YPSI interviews",
    summary: "Residents and workers describe a city they value but increasingly struggle to afford.",
    audioTracks: [
      {
        label: "Peter Choo",
        src: "/audio/archive/peter-choo.m4a",
      },
      {
        label: "Nicole Fan",
        src: "/audio/archive/nicole-fan.m4a",
      },
      {
        label: "David Ranslan",
        src: "/audio/archive/david-ranslan.m4a",
      },
      {
        label: "Kai Kunurat and family",
        src: "/audio/archive/kai-kunurat-family.m4a",
      },
      {
        label: "Ben Dong",
        src: "/audio/archive/ben-dong.m4a",
      },
    ],
    era: "2000s—Now",
    category: "housing",
    story: "Peter Choo has worked in Cupertino for approximately 25 years but lives in Sunnyvale. He argues that the city needs more housing for middle-income employees who work nearby. David Ranslan calls Cupertino a strong place for families but wishes it were less expensive. Kai Kunurat describes the city as comfortable, livable, and community-oriented despite its high cost. Ben Dong remembers housing already being expensive when he purchased a home. Lifelong resident Nicole Fan has watched many peers move away or leave the region, leaving fewer young adults able to remain in the community where they grew up. Together, the interviews reveal the tension between Cupertino’s quality of life and the difficulty of continuing to live there.",
  },
  {
    slug: "a-city-chosen-for-its-schools",
    mediaType: "Audio Collection",
    duration: "~9:00",
    title: "A City Chosen for Its Schools",
    narrators: "Michael Hung, Zhao Han Xu, Phil Sun, and Cupertino parents",
    metadata: "audio collection · multiple interviews oral history · YPSI interviews",
    summary: "Parents explain how schools, libraries, study spaces, and enrichment programs shaped their decisions to move to Cupertino.",
    audioTracks: [
      {
        label: "Michael Hung",
        src: "/audio/archive/michael-hung.m4a",
      },
      {
        label: "Zhao Han Xu",
        src: "/audio/archive/zhao-han-xu.m4a",
      },
      {
        label: "Phil Sun",
        src: "/audio/archive/phil-sun.m4a",
      },
      {
        label: "Long-time Cupertino resident",
        src: "/audio/archive/cupertino-25-year-resident.m4a",
      },
      {
        label: "Cupertino parent",
        src: "/audio/archive/cupertino-parent-schools.m4a",
      },
    ],
    era: "2000s—Now",
    category: "education",
    story: "Education is one of the most frequently stated reasons families moved to Cupertino. Michael Hung’s family purchased a home near a strong high school in approximately 2022. Zhao Han Xu moved for his children’s education and was immediately impressed by the libraries, parks, community center, study rooms, and children’s activities. Phil Sun was similarly drawn to the local high schools and educational culture. A 25-year resident observed that after-school and enrichment organizations have become much more common over time. Together, these interviews show how public schools and the wider educational ecosystem influence Cupertino’s housing choices, migration patterns, family routines, and community identity.",
  },
];

export const ARCHIVE_CATEGORIES = [
  "local history",
  "childhood",
  "immigration",
  "technology",
  "community events",
  "volunteering",
  "youth service",
  "family",
  "library",
  "housing",
  "education",
];
