

import { User } from './entities/User';
import { ormPromise } from './orm-promise'
    
const seed = [
    {
      name: 'Jadzia Dax',
      accounts: [{ routingNumber: '011000015', accountNumber: '6622085487' }]
    },
    {
      name: 'James T. Kirk',
      accounts: [{ routingNumber: '021001208', accountNumber: '0018423486' }]
    },
    {
      name: 'Jean-Luc Picard',
      accounts: [{ routingNumber: '021001208', accountNumber: '1691452698' }]
    },
    {
      name: 'Jonathan Archer',
      accounts: [{ routingNumber: '011000015', accountNumber: '3572176408' }]
    },
    {
      name: 'Leonard McCoy',
      accounts: [{ routingNumber: '011000015', accountNumber: '8149516692' }]
    },
    {
      name: 'Montgomery Scott',
      accounts: [{ routingNumber: '011000015', accountNumber: '7438979785' }]
    },
    {
      name: 'Spock',
      accounts: [
        { routingNumber: '011000015', accountNumber: '1690537988' },
        { routingNumber: '021001208', accountNumber: '1690537989' }
      ]
    },
    {
      name: 'Wesley Crusher',
      accounts: [{ routingNumber: '011000015', accountNumber: '6018423486' }]
    }
  ]
    
;(async () => {
    const orm = await ormPromise
    
    for (const userData of seed) {
        const user = new User(userData)
        orm.em.
    }

  await orm.close(true)
})()
