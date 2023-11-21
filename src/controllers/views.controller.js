import { ProductService } from "../services/products.service.js";
import productModel from "../models/products.model.js";
import cartModel  from "../models/carts.model.js";
import userModel from "../models/user.model.js";
import logger from "../logger.js";
import { Logger } from "winston";

// Controlador para obtener una lista de productos con filtros opcionales
export const getProductController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || "";
        const category = req.query.category || "";
        const availability = parseInt(req.query.stock) || "";

        let filter = {};
        // Aplicar filtro por categoría si se proporciona
        if (req.query.category) {
            filter = { category };
        }
        // Aplicar filtro por stock si se proporciona
        if (req.query.stock) {
            filter = { ...filter, stock: availability };
        }
        let sortOptions = {};
        // Aplicar ordenamiento si se proporciona sort
        if (sort === "asc") {
            sortOptions = { price: 1 };
        } else if (sort === "desc") {
            sortOptions = { price: -1 };
        }
        const options = {
            limit,
            page,
            sort: sortOptions,
            lean: true,
        };

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        // const products = await productModel.paginate(filter, options);
        const products = await ProductService.getAllPaginateView(filter, options);

        let admin = true
        let premium = true

        res.render("products", { products, userInfo, admin, premium });
    } catch (err) {
        logger.error("Error al obtener todos los productos", err)
        res.status(500).json({ error: err });
    }
}

// Controlador para obtener la página de inicio con una lista de productos paginados
export const getHomeController = async (req, res) => {
    try {
        let pageNum = parseInt(req.query.page) || 1;
        let itemsPorPage = parseInt(req.query.limit) || 10;
        const products = await productModel.paginate(
            {},
            { page: pageNum, limit: itemsPorPage, lean: true }
        );

        products.prevLink = products.hasPrevPage
            ? `/products?limit=${itemsPorPage}&page=${products.prevPage}`
            : "";
        products.nextLink = products.hasNextPage
            ? `/products?limit=${itemsPorPage}&page=${products.nextPage}`
            : "";

        logger.debug({products});

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        res.render("home", { products, userInfo });
    } catch (err) {
        logger.error("Error al leer los productos:", err);
        res.status(500).json({ error: "Error al leer los productos", Error: err });
    }
}

// Controlador para obtener una lista de todos los productos en tiempo real
export const realTimeProductsController = async (req, res) => {
    try {
        const allProducts = await ProductService.getAll()
        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };
        res.render("realTimeProducts", { products: allProducts, userInfo });
    } catch (err) {
        logger.error("Error al obtener la lista de productos", err)
        res.status(500).json({ error: err });
    }
}

// Controlador para obtener los detalles de un producto en particular
export const productDetailController = async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductService.getByIdViews(id)
        if (product === null) {
            return res
                .status(404)
                .json({ status: "error", error: "Product not found" });
        }

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        res.render("productDetail", {product, userInfo});
    } catch (err) {
        logger.error("Error al obtener los detalles del producto ACA EL ERROR", err)
        res.status(500).json({ error: "Error al leer los productos", Error: err });
    }
}

// Controlador para obtener los detalles de un carrito en particular
export const cartController = async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).lean().exec();
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Cart not found' });
        }

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };


        res.render('carts', { cid: result._id, cart: result.products, userInfo});
    } catch (err) {
        logger.error("Error al obtener los datos del carrito", err)
        res.status(500).json({ status: 'error', error: err.message });
    }
}

