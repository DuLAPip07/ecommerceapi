const logger = require('./utils/logger');
const express = require('express');
const cors = require('cors')
const app = express();
const fs = require('fs')

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'))
const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf-8'));

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});
app.get('/api/v1/products', (req, res) => {

    let filteredProducts = [...products];

    if (req.query.name) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }

    res.status(200).json({
        status: 'success',
        results: filteredProducts.length,
        data: {
            products: filteredProducts
        }
    });
});

app.get('/api/v1/products/:id', (req, res) => {
const {id} = req.params;

const singleProduct = products.find(product => product.id === Number(id));
if(!singleProduct){
    return res.status(404).json({
        status: 'fail',
        message: 'Product not found '
    })
}
res.status(200).json({
    status: 'success',
    data: {
        product: singleProduct
    }
})
})

app.get('/', (req, res) => {
  res.send('API is working');
});




app.post('/api/v1/products', (req, res) => {

    const { name, price, stock } = req.body;

    if (!name || !price || stock == null) {
        return res.status(400).json({
            status: 'fail',
            message: 'Name, price and stock are required'
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Stock cannot be negative'
        });
    }

    if (price < 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Price cannot be negative'
        });
    }

    const newId = products.length > 0
        ? products.at(-1).id + 1
        : 1;

    const newProduct = { id: newId, name, price, stock };

    products.push(newProduct);

    fs.writeFile(
        './data/products.json',
        JSON.stringify(products, null, 2),
        err => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not store product'
                });
            }

            res.status(201).json({
                status: 'success',
                data: {
                    product: newProduct
                }
            });
        }
    );
});

app.patch('/api/v1/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const productIndex = products.findIndex(
        product => product.id === Number(id)
    );
    if (productIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }

    if (price !== undefined && price < 0) {
        return res.status(400).json({ status: 'fail', message: 'Price cannot be negative' });
    }
    if (stock !== undefined && stock < 0) {
        return res.status(400).json({ status: 'fail', message: 'Stock cannot be negative' });
    }

    // Prevent id overwrite
    const { id: _, ...safeBody } = req.body;
    products[productIndex] = {
        ...products[productIndex],
        ...req.body
    };

    fs.writeFile(
        './data/products.json',
        JSON.stringify(products, null, 2),
        err => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not update product'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    product: products[productIndex]
                }
            });
        }
    );
});

app.delete('/api/v1/products/:id', (req, res) => {
    const { id } = req.params;

    const productIndex = products.findIndex(
        product => product.id === Number(id)
    );

    if (productIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }

    products.splice(productIndex, 1);

    fs.writeFile(
        './data/products.json',
        JSON.stringify(products, null, 2),
        err => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not delete product'
                });
            }

            res.sendStatus(204);
        }
    );
});


app.post('/api/v1/orders', (req, res) => {

    const { productId, quantity, customerName } = req.body;

    // 1. Validate input
    if (!productId || !quantity || !customerName) {
        return res.status(400).json({
            status: 'fail',
            message: 'productId, quantity, and customerName are required'
        });
    }

    // 2. Find product
    const product = products.find(
        p => p.id === Number(productId)
    );

    if (!product) {
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }

    // 3. Check stock
    if (quantity <= 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Quantity must be greater than 0'
        });
    }

    if (product.stock < quantity) {
        return res.status(400).json({
            status: 'fail',
            message: 'Insufficient stock'
        });
    }

    // 4. Create order
    const newOrder = {
        id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
        productId: product.id,
        productName: product.name,
        customerName,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    // 5. Reduce stock
    product.stock -= quantity;

    // 6. Save orders
    fs.writeFile(
        './data/orders.json',
        JSON.stringify(orders, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not save order'
                });
            }

            // 7. Save updated products (IMPORTANT)
            fs.writeFile(
                './data/products.json',
                JSON.stringify(products, null, 2),
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: 'Could not update stock'
                        });
                    }

                    res.status(201).json({
                        status: 'success',
                        data: {
                            order: newOrder
                        }
                    });
                }
            );
        }
    );
});

app.get('/api/v1/orders', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});

app.listen(9000, () =>{
    logger.info('Server is running on port 9000');
})
app.use((err, req, res, next) => {
    logger.error(err.message, err);

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
});