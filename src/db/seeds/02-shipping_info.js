
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shipping_info').del()
    .then(function () {
      // Inserts seed entries
      return knex('shipping_info').insert([
        {
          id: 1, 
          street1: '555 12th St',
          city: 'Oakland',
          state: 'CA',
          zip: '94607'
        },
        {
          id: 2, 
          street1: '999 Manu Aloha St',
          street2: 'Suite 2',
          city: 'Kailua',
          state: 'HI',
          zip: '96734'
        },
      ]);
    });
};
