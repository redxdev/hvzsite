module.exports.badges = {
  enableKillstreaks: true,

  registry: {
  	//Game dependent badges
    headhunter: {
      name: 'Headhunter',
      description: 'Captured a Midday Headhunter.',
      image: 'headhunter.png',
      access: 'admin',
      visibility: 'hidden'
    },
    footsteps: {
      name: 'In Amundsen’s Footsteps',
      description: 'Completed a map and compass orienteering course.',
      image: 'footsteps.png',
      access: 'admin',
      visibility: 'hidden'
    },
    hero: {
      name: 'Continental Hero',
      description: 'Recognised for Greatness.',
      image: 'hero.png',
      access: 'admin',
      visibility: 'hidden'
    },
    midday: {
      name: 'Midday mission',
      description: 'Participated in a midday mission',
      image: 'midday.png',
      access: 'admin',
      visibility: 'name description'
    },
    side: {
      name: 'Side Mission',
      description: '100% completion or bust',
      image: 'side.png',
      access: 'admin',
      visibility: 'name description'
    },
    puzzle: {
      name: 'Puzzle',
      description: 'What’s that? Whodunnit?',
      image: 'puzzle.png',
      access: 'admin',
      visibility: 'name description'
    },
    penguindollars: {
      name: 'Penguin Dollars',
      description: 'You got currency!',
      image: 'penguindollars.png',
      access: 'admin',
      visibility: 'name description'
    },

    // Manual badges
    test: {
      name: 'Test',
      description: 'Test badge, please ignore.',
      image: 'test.png',
      access: 'superadmin',
      visibility: 'hidden'
    },

    // Automated badges
    infected: {
      name: 'Infected',
      description: 'Welcome to the Dead Army',
      image: 'infected.png',
      access: 'internal'
    },
    antivirus: {
      name: 'Used AV',
      description: 'Congratulations on joining the Resistance once more!',
      image: 'antivirus.png',
      access: 'internal'
    },
    oz: {
      name: 'OZ',
      description: 'UUUUURGGHHHHGHGHGH',
      image: 'oz.png',
      access: 'internal'
    },
    earlyRiser: {
      name: 'Early Riser',
      description: 'Caught a capialist between 6 and 8 AM',
      image: 'earlyriser.png',
      access: 'internal'
    },
    missionNotOver: {
      name: 'After-Mission Casualty',
      description: 'Died between 11 PM and midnight',
      image: 'mission-not-over.png',
      access: 'internal'
    },
    badStart: {
      name: 'Fodder',
      description: 'Your sacrifice will not be forgotten, comrade.',
      image: 'badstart.png',
      access: 'internal'
    },
    soClose: {
      name: 'So Close',
      description: 'You lasted until Thursday... so close!',
      image: 'close.png',
      access: 'internal'
    },
    quickTurnaround: {
      name: 'Quick Turnaround',
      description: 'Killed a human within an hour of becoming a zombie',
      image: 'quick.png',
      access: 'internal'
    },

    // Killstreaks
    streak2: {
      name: 'Double Kill',
      description: 'You tagged 2 Researchers within an hour!',
      image: 'streak-2.png',
      access: 'internal'
    },
    streak3: {
      name: 'Triple Kill',
      description: 'You tagged 3 Researchers within an hour!',
      image: 'streak-3.png',
      access: 'internal'
    },
    streak4: {
      name: 'Overkill',
      description: 'You tagged 4 Researchers within an hour!',
      image: 'streak-4.png',
      access: 'internal'
    },
    streak5: {
      name: 'Killtacular',
      description: 'You tagged 5 Researchers within an hour!',
      image: 'streak-5.png',
      access: 'internal'
    },
    streak6: {
      name: 'Killtrocity',
      description: 'You tagged 6 Researchers within an hour!',
      image: 'streak-6.png',
      access: 'internal'
    },
    streak7: {
      name: 'Killmanjaro',
      description: 'You tagged 7 Researchers within an hour!',
      image: 'streak-7.png',
      access: 'internal'
    },
    streak8: {
      name: 'Killtastrophy',
      description: 'You tagged 8 Researchers within an hour!',
      image: 'streak-8.png',
      access: 'internal'
    },
    streak9: {
      name: 'Killpocalypse',
      description: 'You tagged 9 Researchers within an hour!',
      image: 'streak-9.png',
      access: 'internal'
    },
    streak10: {
      name: 'Red Rambo',
      description: 'Honorary Red Rambo. 10 Researchers tagged in an hour',
      image: 'streak-10.png',
      access: 'internal'
    }
  }
};
