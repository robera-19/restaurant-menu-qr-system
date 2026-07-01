"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const qr_routes_1 = __importDefault(require("./routes/qr.routes"));
const rating_routes_1 = __importDefault(require("./routes/rating.routes"));
const customerMenu_1 = __importDefault(require("./routes/customerMenu"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
// Middleware
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use((0, helmet_1.default)());
const origins = process_1.default.env.ALLOWED_ORIGINS
    ? process_1.default.env.ALLOWED_ORIGINS.split(',')
    : [];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (origins.indexOf(origin) !== -1 ||
            process_1.default.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(process_1.default.cwd(), 'uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
    });
});
// ==========================================
// 3. CORE API ROUTES (VERSIONED)
// ==========================================
// AUTH
app.use('/api/v1/auth', auth_routes_1.default);
// ADMIN MENU
app.use('/api/v1/menu', menu_routes_1.default);
// CATEGORIES
app.use('/api/v1/categories', category_routes_1.default);
// QR MANAGEMENT (ADMIN)
app.use('/api/v1/qr', qr_routes_1.default);
// RATINGS
app.use('/api/v1/ratings', rating_routes_1.default);
// ANALYTICS
app.use('/api/v1/analytics', analytics_routes_1.default);
// CUSTOMER MENU (QR BASED ACCESS)
app.use('/api/v1/menu', customerMenu_1.default);
// ==========================================
// 4. 404 HANDLER
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
