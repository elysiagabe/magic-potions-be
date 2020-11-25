
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('billing_info').del()
    .then(function () {
      // Inserts seed entries
      return knex('billing_info').insert([
        {id: 1, ccNum: '1234123412341234', exp: '03/22'},
        {id: 2, ccNum: '1234567812345678', exp: '08/30'},
      ]);
    });
};
