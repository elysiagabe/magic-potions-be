
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert([
        {
          id: 1, 
          customerID: 1,
          quantity: 2,
          total: '99.98'
        },
        {
          id: 2, 
          customerID: 2,
          quantity: 1,
          total: '49.99'
        },
      ]);
    });
};
