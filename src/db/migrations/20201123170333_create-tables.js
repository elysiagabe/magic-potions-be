

exports.up = function(knex) {
    return knex.schema
      // SHIPPING_INFO
      .createTable('shipping_info', tbl => {
          // id, primary key
          tbl.increments();
          // street1, string, required
          tbl.string('street1')
            .notNullable();
          // street2, string, optional
          tbl.string('street2');
          // city, string, required
          tbl.string('city')
            .notNullable();
          // state, string, required
          tbl.string('state')
            .notNullable();
          // zip, string, required
          tbl.string('zip')
            .notNullable();
      })
      
      // BILLING_INFO
      .createTable('billing_info', tbl => {
          // id, primary key
          tbl.increments();
          // ccNum, string, required
          tbl.string('ccNum')
            .notNullable();
          // exp, string, required
          tbl.string('exp')
            .notNullable();
      })

      // CUSTOMERS
      .createTable('customers', tbl => {
          // id, primary key
          tbl.increments();
          // firstName
          tbl.string('firstName')
            .notNullable();
          // lastName
          tbl.string('lastName')
            .notNullable();
          // email
          tbl.string('email')
            .notNullable()
            .unique();
          // phone
          tbl.string('phone')
            .notNullable();
          // billing_id, foreign key
          tbl.integer('billingID')
            .notNullable()
            .references('id')
            .inTable('billing_info')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');  
          // shipping_id, foreign key
          tbl.integer('shippingID')
            .notNullable()
            .references('id')
            .inTable('shipping_info')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      })

      // ORDERS
      .createTable('orders', tbl => {
          // id, primary key
          tbl.increments();
          // customer_id, foreign key
          tbl.integer('customerID')
            .notNullable()
            .references('id')
            .inTable('customers')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
          // quantity
          tbl.integer('quantity')
            .notNullable();
          // total
          tbl.string('total')
            .notNullable();
          // orderDate
          tbl.timestamp('orderDate')
            .defaultTo(knex.fn.now())
          // fulfilled
          tbl.boolean('fulfilled')
            .defaultTo(false)
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('orders')
      .dropTableIfExists('customers')
      .dropTableIfExists('billing_info')
      .dropTableIfExists('shipping_info')
  };
  
