const router = require('express').Router();
const Potions = require('../potions/potions-model');

// TEST ROUTE == GET ALL ORDERS
router.get('/', (req, res) => {
    Potions.getAllOrders()
    .then(orders => {
        if (orders) {
            res.json(orders)
        } else {
            res.status(404).json({ message: "No orders have been placed" })
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: err.message })
    })
});

// GET single recipe by id
router.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;

    let error;

    let order = await Potions.getOrderById(orderId).catch(err => {error = err})
    let address = await Potions.getAddressByOrderId(orderId).catch(err => {error = err})
    let payment = await Potions.getPaymentByOrderId(orderId).catch(err => {error = err})

    if (error) {
        res.status(500).json({ message: error.message })
    } else if (!order[0] || !address[0] || !payment[0]) {
        res.status(404).json({ message: 'resource not found'})
    } else {
        res.json({ ...order[0], address: address[0], payment: payment[0]})
    }
})

// DELETE order
router.delete('/:orderId', (req, res) => {
    const { orderId } = req.params
    Potions.deleteOrder(orderId)
    .then(count => {
        if(count > 0) {
            res.json({ message: 'resource deleted successfully'})
        } else {
            res.status(404).json({ message: 'resource does not exist'})
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})

// PATCH to update fulfilled value
router.patch('/', (req, res) => {
    const { id, fulfilled } = req.body

    Potions.updateOrderStatus(id, fulfilled)
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: 'resource updated successfully' })
        } else {
            res.status(404).json({ message: 'resource not found' })
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})

// POST to create new order
router.post('/', validatePayment, validateAddress, validateCustomerInfo, validateOrderInfo, async (req, res) => {
    const { firstName, lastName, email, phone, address, payment, quantity, total } = req.body

    let error;

    let existingCustomer = await Potions.findCustomerByEmail(email).catch(err => { error = err })

    if (error) {
        res.status(500).json({ message: error.message})
    } else if (existingCustomer[0]) {
        res.status(409).json({ message: 'Customer already exists and may only place one order' })
    } else {
        let billing = await Potions.addBillingInfo(payment).catch(err => { error = err })
        let shipping = await Potions.addShippingInfo(address).catch(err => { error = err })

        let newCustomer = {
            firstName,
            lastName,
            email, 
            phone, 
            billingID: billing[0],
            shippingID: shipping[0]
        }

        let customer = await Potions.addCustomer(newCustomer).catch(err => { error = err })

        let newOrder = { quantity, total, customerID: customer[0]}

        let order = await Potions.addOrder(newOrder).catch(err => {
            error = err
        })

        if (error) {
            res.status(500).json({ message: error.message})
        } else {
            res.status(201).json({ id: order[0] })
        }
    }
})

// ~~ MIDDLEWARE ~~ //
function validatePayment(req, res, next) {
    let currentYear = Number(new Date().getFullYear().toString().slice(2))
    let expYr = Number(req.body.payment.exp.slice(3))

    if (req.body.payment.ccNum.length < 1 && req.body.payment.exp.length < 1) {
        res.status(400).json({ message: "Missing required payment info" })
    } else if (req.body.payment.ccNum.length < 12 || req.body.payment.ccNum.length > 16) {
        res.status(400).json({ message: "Invalid credit card number" })
    } else if (req.body.payment.exp.length < 1 || currentYear > expYr) {
        res.status(400).json({ message: "Invalid expiration date" })
    } else {
        next();
    }
}

function validateAddress(req, res, next) {
    const zipRegex = /^\d{5}(?:[-]\d{4})?$/
    const zip = req.body.address.zip

    if (req.body.address.street1.length < 1 && req.body.address.city.length < 1 && req.body.address.state.length < 1 && req.body.address.city.zip < 1) {
        res.status(400).json({ message: "Missing required address info" })
    } else if (req.body.address.street1.length < 1) {
        res.status(400).json({ message: "Invalid street address" })
    } else if (req.body.address.city.length < 1) {
        res.status(400).json({ message: "Invalid city" })
    } else if (req.body.address.state.length < 1) {
        res.status(400).json({ message: "Invalid state" })
    } else if (!zipRegex.test(zip)) {
        res.status(400).json({ message: "Invalid zip code" })
    } else {
        next()
    }
}

function validateCustomerInfo(req, res, next) {
    if (req.body.firstName.length < 1 && req.body.lastName.length < 1 && req.body.email.length < 1 && req.body.phone.length < 1) {
        res.status(400).json({ message: "Missing required customer information" })
    } else if (req.body.firstName.length < 1) {
        res.status(400).json({ message: "Invalid first name" })
    } else if (req.body.lastName.length < 1) {
        res.status(400).json({ message: "Invalid last name" })
    } else if (req.body.email.length < 3) {
        res.status(400).json({ message: "Invalid email" })
    } else if (req.body.phone.length < 7) {
        res.status(400).json({ message: "Invalid phone number" })
    } else {
        next()
    }
}

function validateOrderInfo(req, res, next) {
    const quantityType = typeof req.body.quantity

    if (req.body.quantity.length < 1 && req.body.total.length < 1) {
        res.status(400).json({ message: "Misisng order information" })
    } else if (quantityType !== "number" || req.body.quantity < 1 || req.body.quantity > 3) {
        res.status(400).json({ message: "Invalid order quantity" })
    } else if (req.body.total !== "49.99" || req.body.total !== "99.98" || req.body.total !== "149.97") {
        res.status(400).json({ message: "Invalid order total" })
    } else {
        next()
    }
}

module.exports = router;