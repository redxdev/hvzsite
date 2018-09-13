module.exports.badges = {
  enableKillstreaks: true,

  registry: {
    // Manual badges

    vial: {
      name: 'Scientific Method',
      description: 'Found a Strange Sample',
      image: 'vial.png',
      access: 'admin',
      visibility: 'name description'
    },
    
    recycling: {
      name: 'Democratic Republic Concerned Citizen',
      description: 'Participated in the Dunwater Bottle Cleanup Project',
      image: 'recycling.png',
      access: 'admin',
      visibility: 'name'
    },

    running: {
      name: 'Roadrunning',
      description: 'Participated in the Dunwater Dash',
      image: 'running.png',
      access: 'admin',
      visibility: 'name'
    },

    bestsinger: {
      name: 'Operatic Overtones',
      description: 'Perfectly primed and pitched performance partly proven by professionals',
      image: 'bestsinger.png',
      access: 'admin',
      visibility: 'name description'
    },

    worstsinger: {
      name: 'Flopera',
      description: 'Demarcation determined by denizens of Dunwater as directly designated derived dumpster fire',
      image: 'worstsinger.png',
      access: 'admin',
      visibility: 'name description'
    },

    engagedcitizen: {
      name: 'Engaged Citizen',
      description: 'Got involved with local politics',
      image: 'voting.png',
      access: 'admin',
      visibility: 'name'
    },
    
    debater: {
      name: 'Master Debater',
      description: 'A crucial volunteer member of their ambiguous political group',
      image: 'debate.png',
      access: 'admin',
      visibility: 'name'
    },

    scribe: {
      name: 'Scribbling Scribe',
      description: 'Putting those night classes to use',
      image: 'scribe.png',
      access: 'admin',
      visibility: 'name'
    },

    test: {
      name: 'Test',
      description: 'Test badge, please ignore.',
      image: 'test.png',
      access: 'superadmin',
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

    oldfart: {
    	name: 'Found the old fart',
    	description: 'Found the ex-President durring the selfie challenge!',
    	image: 'oldfart.png',
    	access: 'admin',
      visibility: 'hidden'
    },

    bottle: {
      name: 'Thirsty',
      description: 'Drank 2 bottles of water in 5 minutes',
      image: 'bottle.png',
      access: 'admin',
      visibility: 'image'
    },

    goldenbottle: {
      name: 'Super Thirsty',
      description: 'Drank 4 bottles of water in 5 minutes',
      image: 'goldenbottle.png',
      access: 'admin',
      visibility: 'image'
    },

    scavengerhunt: {
    	name: 'Dora the Explorer',
    	description: 'Completed the scavenger hunt!',
    	image: 'spyglass.png',
    	access: 'admin',
      visibility: 'hidden'
    },

    moneybags: {
      name: 'Moneybags',
      description: 'Earned an in-game currency for their heroic deeds',
      image: 'moneybags.png',
      access: 'admin',
      visibility: 'hidden'
    },

    // Automated badges
    infected: {
      name: 'Infected',
      description: 'Died in the zombie apocalypse',
      image: 'infected.png',
      access: 'internal'
    },
    antivirus: {
      name: 'Used AV',
      description: 'Used an antivirus to become human again',
      image: 'antivirus.png',
      access: 'internal'
    },
    oz: {
      name: 'OZ',
      description: 'Patient Zero',
      image: 'oz.png',
      access: 'internal'
    },
    earlyRiser: {
      name: 'Early Riser',
      description: 'Caught a human between 6 and 8 AM',
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
      name: 'Red Shirt',
      description: 'Died on Sunday night',
      image: 'badstart.png',
      access: 'internal'
    },
    soClose: {
      name: 'So Close',
      description: 'Died from Thursday onward',
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
      description: '2 kills within an hour',
      image: 'streak-2.png',
      access: 'internal'
    },
    streak3: {
      name: 'Triple Kill',
      description: '3 kills within an hour',
      image: 'streak-3.png',
      access: 'internal'
    },
    streak4: {
      name: 'Overkill',
      description: '4 kills within an hour',
      image: 'streak-4.png',
      access: 'internal'
    },
    streak5: {
      name: 'Killtacular',
      description: '5 kills within an hour',
      image: 'streak-5.png',
      access: 'internal'
    },
    streak6: {
      name: 'Killtrocity',
      description: '6 kills within an hour',
      image: 'streak-6.png',
      access: 'internal'
    },
    streak7: {
      name: 'Killmanjaro',
      description: '7 kills within an hour',
      image: 'streak-7.png',
      access: 'internal'
    },
    streak8: {
      name: 'Killtastrophy',
      description: '8 kills within an hour',
      image: 'streak-8.png',
      access: 'internal'
    },
    streak9: {
      name: 'Killpocalypse',
      description: '9 kills within an hour',
      image: 'streak-9.png',
      access: 'internal'
    },
    streak10: {
      name: 'Killionare',
      description: '10 kills within an hour',
      image: 'streak-10.png',
      access: 'internal'
    }
  }
};
