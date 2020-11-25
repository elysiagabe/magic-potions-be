
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('customers').del()
    .then(function () {
      // Inserts seed entries
      return knex('customers').insert([
        {
          id: 1, 
          firstName: 'Person',
          lastName: 'One',
          email: 'test@user.com',
          phone: '1235551234',
          billingID: 1,
          shippingID: 1
        },
        {
          id: 2, 
          firstName: 'Second',
          lastName: 'User',
          email: 'user@yahoo.com',
          phone: '5551231111',
          billingID: 2,
          shippingID: 2
        },
      ]);
    });
};
