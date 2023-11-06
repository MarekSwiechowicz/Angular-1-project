// TEMPLATE
var INTEGER = null;
var id = null;
var player = {
    id : null,
    name: 'STRING'
};

// GŁOWNY JSON
var tournamentJson = {
  type: 'tournament',
  name: 'STRING',
  id: INTEGER,
  numberOfPlayers: INTEGER,
  players : [player],
  owner: {
    id: null,
    login: 'STRING'
  },
  private: false,
  moderators: [id],
  description: 'STRING',
  blocks: {}                // {1: {vsBlock}, 2: {startListBlock}, ...}
};

// ZMIENNE POMOCNICZE
var input = {
  idBlock: null,
  posInBlock: null,
  Uid: null
};

var score = {
  Uid: null,
  result: null,
  available: true
};


// BLOCZKI

var vsBlock = {
  type: 'versus',
  name: '1 vs 1',
  id: INTEGER,
  inputs: [input, input],       // okresla skad przychodza gracze
  scores: [score, score],       // zawiera posortowana liste graczy z punktami i okresleniem, czy ten gracz jest juz gdzies przypisany dalej
  RRid: 'null/INTEGER',         // jesli mecz jest wpisany do grupy to tutaj jest id grupy, else null
  output: [id],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1,
    maxHeight: 1
  },
  logic: {                  // okreslane w dialogu srubki
    sort: 'desc/asc'        // sortowanie malejace/rosnace
  },
  active: false             // okresla mozliwosc wpisywania wynikow do bloczka przez moderatora
};

var startListBlock = {
  type: 'startList',
  name: 'Start List',
  id: INTEGER,
  output: [id],
  scores: [score, score],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1
  },
  logic: {
    numberOfPlayers: 2,
    rand: false
  },
  active: false
};

var randListBlock = {
  type: 'randListBlock',
  name: 'Rand List',
  id: INTEGER,
  inputs: [input],
  scores: [score, score],
  output: [id],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1
  },
  logic: {
    numberOfPlayers: 2,
    rand: false
  },
  active: false
};

var standingsBlock = {
  type: 'standings',
  name: 'Standings',
  id: INTEGER,
  standingsInputs: [id],
  scores: [score, score],
  output: [id],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1
  },
  logic: {
    sort: 'desc'
  },
  active: false
};

var RRBlock = {
  type: 'RR',
  name: 'RR',
  id: INTEGER,
  inputs: [input],
  scores: [score, score],
  matches: [],            // id z vsBlock
  output: [id],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1
  },
  logic: {
    sort: 'desc',
    numberOfPlayers: 2,
    numberOfRounds: 1,      // liczba kolejek
    modWritesPkt: false,    // jesli ===true to moderator oprocz wyniku wpisuje tez punkty, jesli false to punkty przydzielane są zgodnie z tym co napisane ponizej
           // jesli ===true to okresla jak automatycznie maja byc przydzielone punkty do tabeli po wpisaniu wynikow
    wPkt: 3,                // pojawia sie jesli specifyPkt===true
    dPkt: 1,                // pojawia sie jesli specifyPkt===true
    lPkt: 0,                // pojawia sie jesli specifyPkt===true
  },
  active: false
};

var competitionBlock = {
  type: 'competition',
  name: 'Competition',
  id: INTEGER,
  inputs: [input],
  scores: [score],
  output: [id],
  location: {
    x: 0,
    y: 0
  },
  size: {
    width: 1,
    height: 1
  },
  logic: {
    sort: 'desc',
    numberOfPlayers: INTEGER
  },
  active: false
};
