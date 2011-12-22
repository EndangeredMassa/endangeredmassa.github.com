new TWTR.Widget({
  version: 2,
  type: 'profile',
  rpp: 3,
  interval: 30000,
  width: 'auto',
  height: 300,
  theme: {
    shell: {
      background: '#BBBBBB',
      color: '#000000'
    },
    tweets: {
      background: '#FFFFFF',
      color: '#000000',
      links: '#0000EE'
    }
  },
  features: {
    scrollbar: false,
    loop: false,
    live: false,
    behavior: 'all'
  }
}).render().setUser('endangeredmassa').start();

