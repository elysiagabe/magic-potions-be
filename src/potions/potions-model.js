const db = require('../db/dbConfig');

module.exports = {
    getAllOrders,
    getOrderById, 
    getAddressByOrderId,
    getPaymentByOrderId,
    addBillingInfo,
    addShippingInfo,
    addCustomer,
    findCustomerByEmail,
    addOrder,
    deleteOrder,
    updateOrderStatus,
}

function getAllOrders() {
    return db.select('o.*', 'c.firstName', 'c.lastName', 'c.email')
    .from('orders as o')
    .join('customers as c', 'c.id', 'o.customerID')
}

function getOrderById(orderId) {
    return db.select('c.firstName', 'c.lastName', 'c.email', 'c.phone', 'o.quantity', 'o.total', 'o.orderDate', 'o.fulfilled')
    .from('orders as o')
    .join('customers as c', 'c.id', 'o.customerID')
    .where('o.id', orderId)
}

function getAddressByOrderId(orderId) {
    return db.select('s.street1', 's.street2', 's.city', 's.state', 's.zip')
    .from('orders as o')
    .join('customers as c', 'c.id', 'o.customerID')
    .join('shipping_info as s', 's.id', 'c.shippingID')
    .where('o.id', orderId)
}

function getPaymentByOrderId(orderId) {
    return db.select('b.ccNum', 'b.exp')
    .from('orders as o')
    .join('customers as c', 'c.id', 'o.customerID')
    .join('billing_info as b', 'b.id', 'c.billingID')
    .where('o.id', orderId)
}

function addBillingInfo(paymentInfo) {
    return db('billing_info').insert(paymentInfo, 'id')
}

function addShippingInfo(addressInfo) {
    return db('shipping_info').insert(addressInfo, 'id')
}

function addCustomer(newCustomer) {
    return db('customers').insert(newCustomer, 'id')
}

function findCustomerByEmail(email) {
    return db.select('customers.id').from('customers').where('customers.email', email)
}

function addOrder(newOrder) {
    return db('orders').insert(newOrder, 'id')
}

function deleteOrder(orderId) {
    return db('orders').where('id', orderId).del()
}

function updateOrderStatus(orderId, fulfilled) {
    return db('orders')
    .where('id', orderId)
    .update('fulfilled', fulfilled)
}