module.exports.badges = {
  enableKillstreaks: true,

  registry: {
  	//Game dependent badges
    sciencecraze: {
      name: 'Mad Scientist',
      description: 'For Science! Prone to losing hair.',
      image: 'madScientist.png',
      access: 'admin',
      visibility: 'name'
    },
    cisforcookie: {
      name: 'C is for Cookie',
      description: '',
      image: 'cisforcookie.png',
      access: 'admin',
      visibility: 'hidden'
    },
    seer: {
      name: 'Seer',
      description: '',
      image: 'seer.png',
      access: 'admin',
      visibility: 'hidden'
    },
    hideandseek: {
      name: 'Hide and Seek',
      description: 'Undetectable!',
      image: 'hide.png',
      access: 'admin',
      visibility: 'hidden'
    },
    gravesburghero: {
      name: 'Hero of Gravesburg',
      description: 'You are the hero that Gravesburg needed, maybe not the one they deserved.',
      image: 'gravestone.png',
      access: 'admin',
      visibility: 'hidden'
    },
    proudrussian: {
      name: 'Proud Russian',
      description: 'Пролетарии всех стран, соединяйтесь!',
      image: 'redstar.png',
      access: 'admin',
      visibility: 'hidden'
    },
    socialistscum: {
      name: 'Socialist Scum',
      description: 'You betrayed the Communists, but you also were never a Capitalist. Sucks',
      image: 'scum.png',
      access: 'admin',
      visibility: 'hidden'
    },
    sherifftime: {
      name: 'Sheriff of the Hour',
      description: 'You put some zombies where they belong, in the ground!',
      image: 'sheriff.png',
      access: 'admin',
      visibility: 'name'
    },
    motherland: {
      name: 'The Motherland',
      description: 'The Motherland knows of your accomplishments...',
      image: 'motherland.png',
      access: 'admin',
      visibility: 'hidden'
    },
    rushin: {
      name: 'Rushin Russian',
      description: 'Your dancing skills were impressive!',
      image: 'rushin.png',
      access: 'admin',
      visibility: 'hidden'
    },
    kgb: {
      name: 'KGB',
      description: 'You are an honorary member of the special forces unit. Congratulations!',
      image: 'kgb.png',
      access: 'admin',
      visibility: 'hidden'
    },
    morsemaster: {
      name: 'Morse Master',
      description: 'You have specialized in reading encrypted messages!',
      image: 'spyglass2.png',
      access: 'admin',
      visibility: 'hidden'
    },

    // Manual badges
    test: {
      name: 'Test',
      description: 'Test badge, please ignore.',
      image: 'test.png',
      access: 'superadmin',
      visibility: 'hidden'
    },

    pho: {
      name: 'Send noods',
      description: 'Overseas enjoying some good noodles',
      image: 'pho.png',
      access: 'superadmin',
      visibility: 'hidden'
    },

    stalker: {
    	name: 'Stealthy Snapchatter',
    	description: 'Stealthily Snaped a Snap of a Supreme Administrator',
    	image: 'stalker.jpg',
    	access: 'admin',
    	visibility: 'hidden'
    },

    sock: {
      name: 'Duelist',
      description: 'Beat a mod or admin in a duel',
      image: 'sock.png',
      access: 'admin',
      visibility: 'hidden'
    },

    selfie: {
    	name: 'Selfie Connoisseur',
    	description: 'Participated in the selfie challenge',
    	image: 'camera.png',
    	access: 'admin',
      visibility: 'hidden'
    },

    goldenselfie: {
    	name: 'Found the President',
    	description: 'Found the President durring the selfie challenge!',
    	image: 'goldcamera.png',
    	access: 'admin',
      visibility: 'hidden'
    },

    scavengerhunt: {
    	name: 'Dora the Explorer',
    	description: 'Completed the scavenger hunt!',
    	image: 'spyglass.png',
    	access: 'admin',
      visibility: 'hidden'
    },

    bagsofrubles: {
      name: 'Bags of Rubles',
      description: 'You got some currency!',
      image: 'moneybags.png',
      access: 'admin',
      visibility: 'name description'
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
      description: 'You tagged 2 Captialists within an hour!',
      image: 'streak-2.png',
      access: 'internal'
    },
    streak3: {
      name: 'Triple Kill',
      description: 'You tagged 3 Captialists within an hour!',
      image: 'streak-3.png',
      access: 'internal'
    },
    streak4: {
      name: 'Overkill',
      description: 'You tagged 4 Captialists within an hour!',
      image: 'streak-4.png',
      access: 'internal'
    },
    streak5: {
      name: 'Killtacular',
      description: 'You tagged 5 Captialists within an hour!',
      image: 'streak-5.png',
      access: 'internal'
    },
    streak6: {
      name: 'Killtrocity',
      description: 'You tagged 6 Captialists within an hour!',
      image: 'streak-6.png',
      access: 'internal'
    },
    streak7: {
      name: 'Killmanjaro',
      description: 'You tagged 7 Captialists within an hour!',
      image: 'streak-7.png',
      access: 'internal'
    },
    streak8: {
      name: 'Killtastrophy',
      description: 'You tagged 8 Captialists within an hour!',
      image: 'streak-8.png',
      access: 'internal'
    },
    streak9: {
      name: 'Killpocalypse',
      description: 'You tagged 9 Captialists within an hour!',
      image: 'streak-9.png',
      access: 'internal'
    },
    streak10: {
      name: 'Red Rambo',
      description: 'Honorary Red Rambo. 10 Captialists tagged in an hour',
      image: 'streak-10.png',
      access: 'internal'
    }
  }
};
